import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCardBody,
  MDBTypography,
  MDBIcon,
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
} from "mdb-react-ui-kit";
import Draggable from "react-draggable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowMinimize, faTimes } from "@fortawesome/free-solid-svg-icons";
import Peer from "simple-peer";
import io from "socket.io-client";
import { Input } from "@chakra-ui/react";
import { faMicrophone, faPhone, faVideo } from "@fortawesome/free-solid-svg-icons"; // Import FontAwesome icons

// const socket = io.connect("https://x2024safecall3173801594000.westeurope.cloudapp.azure.com:5000/");
const socket = io.connect("http://localhost:5002/");


export default function ECommerce() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Nb, setNb] = useState("");
  const [Description, setDescription] = useState("");
  const [Load, setLoad] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  // Call
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [micro, setMicro] = useState(true);
  const [wasMicroEnabled, setWasMicroEnabled] = useState(true);
  const [sound, setSound] = useState(true);
  const [cam, setCam] = useState(true);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const [showCallRequestModal, setShowCallRequestModal] = useState(false);

  function CustomModal({ callerName, onAcceptCall, onDeclineCall }) {
    console.log("CustomModal rendering"); // For debugging

    return (
      <MDBModal show={showCallRequestModal} tabIndex='1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalBody>
              <h4 className="modal-title">Incoming Call</h4>
              <p>{callerName} is calling you.</p>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='danger' onClick={onDeclineCall}>Decline</MDBBtn>
              <MDBBtn color='success' onClick={onAcceptCall}>Accept</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    );
  }

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
  
    console.log("CallUser function called"); // Add this line for debugging
  
    peer.on("signal", (data) => {
      console.log("Peer.onSignal", data);
      socket.emit("callUser", {
        userToCall: id,
        signalData: data, // Use data received from the "signal" event
        from: me,
      });
    });
  
    peer.on("stream", (stream) => {
      console.log("Peer.onStream", stream);
      if (userVideo.current) userVideo.current.srcObject = stream;
    });
  
    socket.on("callEnded", () => {
      leaveCall();
    });
  
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
  
    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      stream.getAudioTracks()[0].enabled = sound;
      if (userVideo.current) userVideo.current.srcObject = stream;
    });

    socket.on("callEnded", () => {
      leaveCall();
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    socket.disconnect();
  };

  const muteMicro = () => {
    if (!sound) {
      muteSound();
      stream.getAudioTracks()[0].enabled = true;
      setMicro(true);
    } else {
      stream.getAudioTracks()[0].enabled = !micro;
      setMicro(!micro);
    }
  };

  const cutCam = () => {
    stream.getVideoTracks()[0].enabled = !cam;
    setCam(!cam);
  };

  const muteSound = () => {
    if (!sound && wasMicroEnabled) {
      stream.getAudioTracks()[0].enabled = true;
      if (userVideo.current)
        userVideo.current.srcObject.getAudioTracks()[0].enabled = true;
      setMicro(true);
    } else {
      if (userVideo.current)
        userVideo.current.srcObject.getAudioTracks()[0].enabled = false;
      stream.getAudioTracks()[0].enabled = false;
    }
    setWasMicroEnabled(micro);
    if (sound) setMicro(false);
    setSound(!sound);
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      console.log("UseEffectMedia", stream);
      setStream(stream);
      if (myVideo.current) myVideo.current.srcObject = stream;
    });
    console.log("En dehors", myVideo);
    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
      setShowCallRequestModal(true); // Show the call request modal
      CustomModal({ callerName: data.callerName, onAcceptCall: acceptCall, onDeclineCall: declineCall });

    });
    
  }, []);

  const acceptCall = () => {
    answerCall();
    setShowCallRequestModal(false); // Close the call request modal after accepting
  };

  const declineCall = () => {
    // Add logic to decline the call if needed
    setShowCallRequestModal(false); // Close the call request modal after declining
  };

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(
        `https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/profile/${user}`
      );
      setName(res.data["profile"]["FullName"]);
      setEmail(res.data["profile"]["Email"]);
      setNb(res.data["profile"]["PhoneNb"]);
      setDescription(res.data["profile"]["Description"]);
      setLoad(false);
    }
    fetchData();
  }, []);

  // Function to toggle mute status
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Function to toggle sound mute status
  const toggleSoundMute = () => {
    setIsSoundMuted(!isSoundMuted);
  };

  // Function to minimize the modal
  const minimizeModal = () => {
    // Add logic to minimize the modal here
    // You can hide it, minimize it to a corner, or perform any other necessary actions.
  };

  // Function to close the modal
  const closeModal = () => {
    // Add logic to close the modal here
  };

  // Calculate call duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setCallDuration(callDuration + 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [callDuration]);

  return (
  <div className="vh-100" style={{ backgroundColor: "#E6E6E6" }}>
    <MDBContainer>
      <MDBRow className="justify-content-center">
        <MDBCol md="6" lg="5" xl="4" className="mt-5">
          {/* Top part of the screen */}
          <div className="text-center mb-4">
            <h4>My ID = {me}</h4>
          </div>

          {/* Left part of the screen */}
          <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: '20px' }}>
  <div className="text-center mb-4">
    {/* Center the input field */}
    <input
      onChange={(e) => setIdToCall(e.target.value)}
      value={idToCall}
      placeholder="Enter User ID"
      className="form-control"
    />
    <MDBBtn
      color="success"
      onClick={() => callUser(idToCall)}
      style={{ marginTop: "10px" }}
    >
      <i className="fas fa-phone"></i> Call
    </MDBBtn>
  </div>

  {/* Video feeds */}
  {callAccepted && !callEnded ? (
    <div className="video-container">
      <div className="video">
        <video
          playsInline
          muted
          ref={myVideo}
          autoPlay
          style={{ width: "90%" }}
        />
      </div>
      <div className="video">
        <video
          playsInline
          ref={userVideo}
          autoPlay
          style={{ width: "90%" }}
        />
      </div>
    </div>
  ) : null}

  {callAccepted && !callEnded && (
    <div className="call-controls">
      {/* Button to end the call */}
      <MDBBtn
        color="danger"
        onClick={() => leaveCall()}
        style={{ marginRight: "10px" }}
      >
        <i className="fas fa-phone-slash"></i>
      </MDBBtn>
      <MDBBtn
        color="primary"
        onClick={() => muteMicro()}
        style={{ marginRight: "10px" }}
      >
        {micro ? (
          <>
            <i className="fas fa-microphone"></i>
          </>
        ) : (
          <>
            <i className="fas fa-microphone-slash"></i>
          </>
        )}
      </MDBBtn>
      {/* Button to hide/unhide your camera */}
      <MDBBtn
        color="success"
        onClick={() => cutCam()}
      >
        {cam ? (
          <>
            <i className="fas fa-video me-2"></i>
          </>
        ) : (
          <>
            <i className="fas fa-video-slash me-2"></i>
          </>
        )}
      </MDBBtn>
    </div>

            )}
          </div>
        </MDBCol>
        <MDBCol md="6" lg="5" xl="4" className="mt-5">
          {/* Right part of the screen for conversation box */}
          <div style={{ backgroundColor: "#f2f2f2", padding: "30px", borderRadius: '20px' }}>
            {/* Add your conversation box component here */}
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>

    {/* Modal rendering */}
    {showCallRequestModal && (
      <CustomModal
        callerName={caller} // Pass the caller's name as a prop
        onAcceptCall={acceptCall}
        onDeclineCall={declineCall}
      />
    )}
  </div>
);
    }