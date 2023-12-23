import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBModalTitle,
  MDBBtn,
} from "mdb-react-ui-kit";

import Draggable from "react-draggable";
import Peer from "simple-peer";
import io from "socket.io-client";

const socket = io.connect("https://x2024safecall3173801594000.westeurope.cloudapp.azure.com:5000/");

export default function ECommerce() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Nb, setNb] = useState("");
  const [Description, setDescription] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [Load, setLoad] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false); // Initially set to true
  const [showCallAnswerModal, setShowCallAnswerModal] = useState(false);

  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    console.log("Call print myvideo", myVideo)

    peer.on("signal", (data) => {
      console.log("Peer.onSignal", data)
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
      });
    });

    peer.on("stream", (stream) => {
      console.log("Peer.onStream", stream)
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

  const answerCall = () => {
    setCallAccepted(true);
    // setShowCallPopup(false); // Remove this line to keep the call popup open
    setShowCallAnswerModal(true); // Show the call answer modal
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
  
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
  
    peer.on("stream", (stream) => {
      // Check if audio should be muted based on isSoundMuted state
      stream.getAudioTracks()[0].enabled = !isSoundMuted;
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
    // connectionRef.current.destroy();
  };

  const rejectCall = () => {
    setShowCallPopup(false);
    setReceivingCall(false);
    // Additional logic for rejecting the call
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
    });

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
      setShowCallPopup(true); // Show the modal
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/profile/${user}`);
      setName(res.data["profile"]["FullName"]);
      setEmail(res.data["profile"]["Email"]);
      setNb(res.data["profile"]["PhoneNb"]);
      setDescription(res.data["profile"]["Description"]);
      setLoad(false);
    }
    fetchData();
  }, []);

  const CallAnswerModal = () => (
    <MDBModal show={showCallAnswerModal} tabIndex="-1">
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Call Accepted</MDBModalTitle>
          </MDBModalHeader>
          <MDBModalBody>
            <p>You have accepted the call from {caller}.</p>
            
            {/* Place the video container here */}
            <div className="video-container">
              <div className="video">
                {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
              </div>
              <div className="video">
                {callAccepted && !callEnded && <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} />}
              </div>
            </div>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="danger" onClick={leaveCall}>End Call</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
  
  

  const CallPopupModal = () => (
    <MDBModal show={showCallPopup} tabIndex="-1">
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Incoming Call</MDBModalTitle>
          </MDBModalHeader>
          <MDBModalBody>
            <p>You have an incoming call from {caller}.</p>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="danger" onClick={rejectCall}>Reject</MDBBtn>
            <MDBBtn color="success" onClick={answerCall}>Accept</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );

  return (
    <div className="vh-100" style={{ backgroundColor: "#E6E6E6" }}>
      <MDBContainer>
        <MDBRow className="justify-content-center">
          <MDBCol md="9" lg="7" xl="5" className="mt-5">
            <button onClick={() => setModalShow(true)}>Open Modal</button> {/* Button to open modal */}
            
            {/* Modal Structure */}
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
                        <h4>TEST me.id = {me} </h4>
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
                          <h1>Call received...</h1>
                          <button onClick={answerCall}>Answer</button>
                        </div>
                      ) : null}
  
                      <div className="video-container">
                        <div className="video">
                          {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
                        </div>
                        <div className="video">
                          {callAccepted && !callEnded ? <video playsInline ref={userVideo} autoPlay style={{ width: "300px"}} /> : null}
                        </div>
                      </div>
                    </MDBModalBody>
                  </MDBModalContent>
                </Draggable>
              </MDBModalDialog>
            </MDBModal>
  
            {/* Call Popup Modal */}
            <CallPopupModal />
            
            {/* Call Answer Modal */}
            <CallAnswerModal />
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
