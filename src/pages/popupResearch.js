import React, { useState } from 'react';
import axios from 'axios';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon, MDBInputGroup, MDBInput } from 'mdb-react-ui-kit';

export default function App() {

    const user = JSON.parse(localStorage.getItem('user'));


    const [Name, setName] = useState('');
    const [Email, setEmail] = useState('');
    const [Nb, setNb] = useState('');
    const [Description, setDescription] = useState('');
    const [selectedResult, setSelectedResult] = useState(null);
    const [ProfilePic, setProfilePic] = useState("https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png");


    const handleSearch = async () => {
        try {
            const res = await axios.get(`https://20.234.168.103:8080/profile/${user}`);
            if (res.data['profile']) {
                setSelectedResult(res.data['profile']);
            } else {
                setSelectedResult(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await axios.get(`https://20.234.168.103:8080/profile/${user}`);        
            setProfilePic(res.data['profile']['ProfilePic']);
          } catch (err) {
            console.error(err);
          }
        };
        fetchData();
      }, []);

    return (
        <div className="vh-100" style={{ backgroundColor: '#E6E6E6' }}>
            <MDBContainer>
                <MDBRow className="justify-content-center">
                    <MDBCol md="9" lg="7" xl="5" className="mt-5">
                        <MDBCard style={{ borderRadius: '15px', backgroundColor: '#D0CBC8' }}>
                            <MDBCardBody className="p-4 text-black">
                            <MDBInputGroup className="mb-3">
                            <MDBInput
                                label="Search"
                                labelClass="text-dark"
                                type="text"
                                value={Name}
                                onChange={(e) => setName(e.target.value)}
                                inputClass="text-dark"
                            />
                            <MDBBtn color="dark" onClick={handleSearch}>
                                <MDBIcon fas icon="search" />
                            </MDBBtn>
                            </MDBInputGroup>
                                {selectedResult ? (
                                    <div>
                                        <MDBTypography tag="h5">{selectedResult['FullName']}</MDBTypography>
                                        <div className="d-flex align-items-center justify-content-between mb-3">
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
                                        <MDBCardText>{selectedResult['Description']}</MDBCardText>
                                        <hr />
                                        <MDBCardText>Email: {selectedResult['Email']}</MDBCardText>
                                        <MDBCardText>Phone Number: {selectedResult['PhoneNb']}</MDBCardText>
                                        <MDBBtn color="dark" rounded block size="lg">
                                            <MDBIcon /> + Add Contact
                                        </MDBBtn>
                                    </div>
                                ) : (
                                    <div>
                                        <MDBTypography tag="h5">No search result found.</MDBTypography>
                                    </div>
                                )}
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </div>
    );
}  