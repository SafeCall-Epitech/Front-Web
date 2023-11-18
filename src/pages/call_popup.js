import React, { useState, useEffect } from "react";
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
} from "mdb-react-ui-kit";
import Draggable from "react-draggable";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowMinimize, faTimes } from "@fortawesome/free-solid-svg-icons";

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

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(
        `http://20.234.168.103:8080/profile/${user}`
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
                        <button
                          className="btn btn-link btn-sm text-dark"
                          onClick={minimizeModal}
                        >
                          <FontAwesomeIcon icon={faWindowMinimize} />
                        </button>
                        <button
                          className="btn btn-link btn-sm text-dark"
                          onClick={closeModal}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                        
                      </div>
                      <MDBCard
                        style={{ borderRadius: "15px", backgroundColor: "#E6E6E6" }}
                      >
                        <MDBCardBody className="p-4 text-black">
                          <p className="title mb-4">
                                Name 2
                              </p>  
                          <div>
                            <MDBTypography tag="p">
                            <MDBIcon far icon="clock me-2" />
                              {callDuration} seconds
                            </MDBTypography>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              
                            </div>
                          </div>
                          <div className="d-flex align-items-center mb-4">
                            {/* Add mute and sound mute buttons */}
                            <MDBBtn
                              color={isMuted ? "danger" : "success"}
                              rounded
                              size="sm"
                              onClick={toggleMute}
                            >
                              {isMuted ? "Unmute" : "Mute"}
                            </MDBBtn>
                            <MDBBtn
                              color={isSoundMuted ? "danger" : "success"}
                              rounded
                              size="sm"
                              onClick={toggleSoundMute}
                            >
                              {isSoundMuted ? "Unmute Sound" : "Mute Sound"}
                            </MDBBtn>
                          </div>
                          <hr />
                          <MDBBtn
                            color="dark"
                            rounded
                            block
                            size="lg"
                            onClick={closeModal}
                          >
                            End Call
                          </MDBBtn>
                        </MDBCardBody>
                      </MDBCard>
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
