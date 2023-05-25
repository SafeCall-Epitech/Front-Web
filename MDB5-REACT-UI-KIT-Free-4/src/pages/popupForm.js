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
    const [Guest1, setGuest1] = useState('');
    const [Guest2, setGuest2] = useState('');
    const [Subject, setSubject] = useState('');
    const [Date, setDate] = useState('');
    const [modalShow, setModalShow] = useState(true);

    const SendCallForm = async () => {
        const form = JSON.stringify({
            guest1: Guest1,
            guest2: Guest2,
            subject: Subject,
            date: Date,
        });
        axios.post(`http://20.234.168.103:8080/addEvent`, form, {
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
                                    <MDBModalBody>
                                        <MDBCard style={{ borderRadius: "15px", backgroundColor: "#E6E6E6" }}>
                                            <MDBCardBody className="p-4 text-black">

                                                <p className="lead fw-normal mb-1">Call Form</p>
                                                <label htmlFor="name">Guest1:</label>
                                                <br />
                                                <input
                                                    type="text"
                                                    value={Guest1}
                                                    onChange={(e) => setGuest1(e.target.value)}
                                                />
                                                <br />
                                                <br />
                                                <label htmlFor="name">Guest2:</label>
                                                <br />
                                                <input
                                                    type="text"
                                                    value={Guest2}
                                                    onChange={(e) => setGuest2(e.target.value)}
                                                />
                                                <br />
                                                <br />
                                                <label htmlFor="name">Subject:</label>
                                                <br />
                                                <input
                                                    type="text"
                                                    value={Subject}
                                                    onChange={(e) => setSubject(e.target.value)}
                                                />
                                                <br />
                                                <br />
                                                <label htmlFor="name">Date:</label>
                                                <br />
                                                <input
                                                    type="text"
                                                    value={Date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                />
                                                <br />
                                                <br />
                                                <MDBBtn
                                                    color="primary"
                                                    rounded
                                                    size="lg"
                                                    onClick={() => {
                                                        SendCallForm();
                                                    }}
                                                >
                                                    - Send Form
                                                </MDBBtn>
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
