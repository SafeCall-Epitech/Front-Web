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
import { useParams } from 'react-router-dom';
import Draggable from "react-draggable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowMinimize, faTimes } from "@fortawesome/free-solid-svg-icons";
import Peer from "simple-peer";
import io from "socket.io-client";
import { Input } from "@chakra-ui/react";
import { faMicrophone, faPhone, faVideo } from "@fortawesome/free-solid-svg-icons"; // Import FontAwesome icons
import { faVolumeHigh, faVolumeMute } from "@fortawesome/free-solid-svg-icons";


  const socket = io.connect("https://x2024safecall3173801594000.westeurope.cloudapp.azure.com:5000/");


export default function ECommerce() {
  const user = JSON.parse(localStorage.getItem("user"));
  let { username } = useParams();  // This extracts 'username' from the URL

  const fetchData = async () => {
    if (username) {
      const res = await axios.get(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/profile/${username}`);
      console.log("Guest : ", username);
      console.log("User : ", user);

      // Use the response data as needed
      socket.emit("pseudo", {
        pseudo: user
      });
      setIdToCall(username)
    }
  };

  // ... rest of your component ...

  //console.log("Guests:", guests);

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
  const [friendsList, setFriendsList] = useState([]);

  const [showCallRequestModal, setShowCallRequestModal] = useState(false);
  sessionStorage.setItem("user_name", JSON.parse(localStorage.getItem('user')).toLowerCase())


  function CustomModal({ callerName, onAcceptCall, onDeclineCall }) {
    console.log("CustomModal rendering"); // For debugging

    return (
      <MDBModal show={showCallRequestModal} tabIndex='1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalBody>
              <h4 className="modal-title">Incoming Call</h4>
              <p>{idToCall} is calling you.</p>
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
      socket.emit("callUser", {
        userToCall: id,
        signalData: data, // Use data received from the "signal" event
        from: me,
      });
    });

    peer.on("stream", (str) => {
      console.log("Peer.onStream", str);
      if (userVideo.current) userVideo.current.srcObject = str;
      if (myVideo.current) myVideo.current.srcObject = stream;

    });

    socket.on("callEnded", () => {
      endCall();
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

    peer.on("stream", (str) => {
      str.getAudioTracks()[0].enabled = sound;
      if (userVideo.current) userVideo.current.srcObject = str;
      if (myVideo.current) myVideo.current.srcObject = stream;
    });

    socket.on("callEnded", () => {
      endCall();
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const endCall = () => {
    console.log("endCall function")
    setCallEnded(true);
    setReceivingCall(false);
    setCallAccepted(false);
    if (userVideo.current) {
      userVideo.current = null;
    }
    if (connectionRef.current && connectionRef.current.srcObject) {
      connectionRef.current.destroy();
    }
  }

  const leaveCall = () => {
    console.log("leaveCall function")
    socket.emit("endCall")
    endCall();

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
    if (myVideo.current)
      myVideo.current.srcObject = stream;
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
      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
    });

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callReceived", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
      setShowCallRequestModal(true); // Show the call request modal
      CustomModal({ callerName: data.callerName, onAcceptCall: acceptCall, onDeclineCall: declineCall });
    });

    fetchData();

  }, [username]);

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
              <h4>My ID = {user}</h4>
            </div>

            <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: '20px' }}>
              <div className="text-center mb-4">
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
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="video">
                    <video
                      playsInline
                      ref={userVideo}
                      autoPlay
                      style={{ width: "100%" }}
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
                   {/* Button to mute/demute the sound */}
                   <MDBBtn
                    color="primary"
                    onClick={() => muteSound()}
                    style={{ marginRight: "10px" }}

                  >
                    {sound ? (
                      <FontAwesomeIcon icon={faVolumeHigh} />
                    ) : (
                      <FontAwesomeIcon icon={faVolumeMute} />
                    )}
                  </MDBBtn>
                  {/* Button to hide/unhide your camera */}
                  <MDBBtn
                    color="success"
                    onClick={() => cutCam()}
                    style={{ marginRight: "10px" }}

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
