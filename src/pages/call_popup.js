import React, {useEffect, useRef, useState} from "react"
import axios from "axios";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
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

import Peer from "simple-peer"
import io from "socket.io-client"
import { Input } from "@chakra-ui/react";

const socket = io.connect("http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:5000");

export default function ECommerce() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Nb, setNb] = useState("");
  const [Description, setDescription] = useState("");
  const [modalShow, setModalShow] = useState(true);
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

  const callUser = (id) => {
    console.log("CallUser");
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current)
        userVideo.current.srcObject = stream;
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

  const leaveCall = () => {
    setCallEnded(true);
    socket.disconnect();
//    connectionRef.current.destroy();
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
    if (sound)
      setMicro(false);
    setSound(!sound);
  }

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => {
      setStream(stream);
      if (myVideo.current)
        myVideo.current.srcObject = stream;
    });

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      console.log("UseEffectCallUser", data)
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, []);


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
    setModalShow(false);
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
          <MDBCol md="9" lg="7" xl="5" className="mt-5">
            <MDBModal
              show={modalShow}
              tabIndex="-1"
              onClick={() => setModalShow(false)}
            >
              <MDBModalDialog>
                <Draggable>
                  <MDBModalContent>
                  <MDBModalBody onClick={(e) => e.stopPropagation()}>
                      <div className="d-flex justify-content-end">
                        <h4>TEST me.id = {me}endme </h4>
                        </div>
                        <input onChange={(e) => setIdToCall(e.target.value)} value={idToCall} ></input>
                        <h4>Test ID to call : {idToCall}</h4>
                        <button style={{backgroundColor: "red"}} onClick={() => callUser(idToCall)}>
                          call 
                        </button>
                        <h1>is receiving a call ? {receivingCall.toString()}</h1>
                        <h1>is callAccepted ? {callAccepted.toString()}</h1>
                        {receivingCall && !callAccepted ? (
                        <div className="caller">
                        <h1 >Call received...</h1>
                          <button onClick={answerCall} >Answer</button>
                      </div>
                    ) : null}

                    </MDBModalBody>
                  </MDBModalContent>
                </Draggable>
              </MDBModalDialog>
            </MDBModal>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
