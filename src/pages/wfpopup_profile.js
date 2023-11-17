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

  const user = JSON.parse(localStorage.getItem('user'));

  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Nb, setNb] = useState("");
  const [Description, setDescription] = useState("");
  const [modalShow, setModalShow] = useState(true);
  const [Load, setLoad] = useState(true);
  const [ProfilePic, setProfilePic] = useState("https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png");

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(
        `http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/profile/${user}`
      );
      setName(res.data["profile"]["FullName"]);
      setEmail(res.data["profile"]["Email"]);
      setNb(res.data["profile"]["PhoneNb"]);
      setDescription(res.data["profile"]["Description"]);
      setProfilePic(res.data['profile']['ProfilePic']);
      setLoad(false);
    }
    fetchData();
  }, []);

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
                        <div>

                          {Load ? <MDBTypography tag="h5">No Name</MDBTypography>
                            :
                            <MDBTypography tag="h5">{Name}</MDBTypography>
                          }
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <p className="small mb-0"><MDBIcon far icon="clock me-2" />6 hrs ago</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center mb-4">
                          <div className="flex-shrink-0">
                            <MDBCardImage
                              style={{ width: '70px' }}
                              className="img-fluid rounded-circle border border-dark border-3"
                              src={ProfilePic}
                              alt='Generic placeholder image'
                              fluid />
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <div className="d-flex flex-row align-items-center mb-2">
                              <p className="mb-0 me-2">@ID</p>
                              <ul className="mb-0 list-unstyled d-flex flex-row" style={{ color: '#1B7B2C' }}>
                                <li>
                                  <MDBIcon fas icon="star fa-xs" />
                                </li>
                                <li>
                                  <MDBIcon fas icon="star fa-xs" />
                                </li>
                                <li>
                                  <MDBIcon fas icon="star fa-xs" />
                                </li>
                                <li>
                                  <MDBIcon fas icon="star fa-xs" />
                                </li>
                                <li>
                                  <MDBIcon fas icon="star fa-xs" />
                                </li>
                              </ul>

                            </div>
                            <div>
                              <MDBBtn outline color="dark" rounded size="sm" className="mx-1">profile</MDBBtn>
                              <MDBBtn outline color="dark" floating size="sm"><MDBIcon fas icon="comment" /></MDBBtn>
                            </div>
                          </div>
                        </div>
                        <hr />
                        <MDBBtn color="dark" rounded block size="lg">
                          <MDBIcon /> + Add Contact
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