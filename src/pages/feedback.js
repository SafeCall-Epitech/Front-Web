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
    MDBCardImage,
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalBody,
    MDBModalFooter
} from "mdb-react-ui-kit";

export default function ECommerce() {

    const [Name, setName] = useState('');
    const [Email, setEmail] = useState('');
    const [Nb, setNb] = useState('');
    const [Description, setDescription] = useState('');

    //Dynamic parameters for the call form
    const [Feedback, setFeedback] = useState('');
    const [Date, setDate] = useState('');
    const [modalShow, setModalShow] = useState(true);

    const SendCallForm = async () => {
        const form = JSON.stringify({
            username: "Anonymous",
            date: Date,
            message: Feedback,
        });
        axios.post(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/feedback`, form, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                console.log(res.data)
            })
    }
    return (
        <div className="vh-100" style={{ backgroundColor: "#E6E6E6" }}>
            <MDBContainer>
                <MDBRow className="justify-content-center">
                    <MDBCol md="9" lg="7" xl="5" className="mt-5">
                        <MDBBtn color="dark" rounded onClick={() => setModalShow(true)}>
                            Open Pop-up
                        </MDBBtn>
    
                        <MDBModal show={modalShow} tabIndex="-1" onClick={() => setModalShow(false)}>
                            <MDBModalDialog>
                                <MDBModalContent>
                                    <MDBModalBody onClick={(e) => e.stopPropagation()}>
                                        <MDBCard style={{ borderRadius: "15px", backgroundColor: "#E6E6E6" }}>
                                            <MDBCardBody className="p-4 text-black">
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <p className="lead fw-normal mb-1" style={{ fontSize: '24px' }}>Feedback Form</p> {/* Making title a bit bigger */}
                                                    <span style={{ alignSelf: 'flex-start' }}>Anonymous</span> {/* Anonymous in top right */}
                                                </div>
                                                <label htmlFor="name">Date:</label>
                                                <br />
                                                <input
                                                    type="text"
                                                    value={Date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                />
                                                <br />
                                                <br />
                                                <label htmlFor="feedback">Feedback:</label>
                                                <br />
                                                <textarea
                                                    value={Feedback}
                                                    onChange={(e) => setFeedback(e.target.value)}
                                                    style={{ width: "100%", height: "100px" }}
                                                />
                                                <div style={{ textAlign: 'right' }}>
                                                    <MDBBtn
                                                        color="dark"
                                                        rounded
                                                        size="sm"
                                                        onClick={() => {
                                                            SendCallForm();
                                                        }}
                                                    >
                                                        Send
                                                    </MDBBtn>
                                                </div>
                                            </MDBCardBody>
                                        </MDBCard>
                                    </MDBModalBody>
                                </MDBModalContent>
                            </MDBModalDialog>
                        </MDBModal>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </div>
    );
    
}