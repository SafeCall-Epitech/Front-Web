import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage,
  MDBBtn, MDBTypography, MDBIcon, MDBInputGroup, MDBInput,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalBody,
} from 'mdb-react-ui-kit';

export default function App() {
  const [invitationSent, setInvitationSent] = useState(false); // State variable to track invitation status
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Nb, setNb] = useState('');
  const [Description, setDescription] = useState('');
  const [selectedResult, setSelectedResult] = useState(null);
  const [friendsList, setFriendsList] = useState([]);
  const navigate = useNavigate();
  const isFriend = friendsList.some((friend) => friend.name === Name);
  const [ProfilePic, setProfilePic] = useState("https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png");
  const user = JSON.parse(localStorage.getItem('user'));
  const [modalShow, setModalShow] = useState(false); // State variable for modal visibility
  const [Subject, setSubject] = useState(''); // State variable for the subject in the modal

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    async function fetchFriends() {
      try {
        const response = await axios.get(`/api/listFriends/${user}`);
        const fetchedData = response.data.fetched;
        const friendsListData = fetchedData.map((name) => ({ name }));
        setFriendsList(friendsListData);
      } catch (error) {
        console.error(error);
      }
    }
    fetchFriends();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://20.234.168.103:8080/profile/${Name}`);
      if (res.data['profile']) {
        setName(res.data['profile']['FullName']);
        setEmail(res.data['profile']['Email']);
        setNb(res.data['profile']['PhoneNb']);
        setDescription(res.data['profile']['Description']);
        setSelectedResult(res.data['profile']);
        setProfilePic(res.data['profile']['ProfilePic']);
      } else {
        setSelectedResult(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const DeleteFriend = async () => {
    try {
      const form = JSON.stringify({
        UserID: user,
        Friend: Name,
        Action: "rm",
      });
      await axios.post(`/api/manageFriend`, form, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Update the friendsList state by filtering out the removed friend
      setFriendsList(friendsList.filter((friend) => friend.name !== Name));
    } catch (err) {
      console.error(err);
    }
    console.log(Name);
  };


  const AddFriend = async () => {
    try {
      const form = JSON.stringify({
        UserID: user,
        Friend: Name,
        Action: "add",
      });
      await axios.post(`/api/manageFriend`, form, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

    } catch (err) {
      console.error(err);
    }
  };

  const redirectToProfile = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const isFriend = friendsList.some((friend) => friend.name === Name);

    if (isFriend) {
      console.log("isFriend");
      navigate(`/My_wfriend_profile/${Name}`);
    } else {
      console.log("not");
      navigate(`/My_user_profile/${Name}`);
    }
  };

  const SendCallForm = async () => {
    // Implement the logic to send the call form data
    try {
      // Assuming you send the form data here

      // After the form is successfully sent, call the AddFriend function
      await AddFriend();

      // Update the invitationSent state to indicate that the invitation is sent
      setInvitationSent(true);

      // Close the modal
      setModalShow(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="vh-100" style={{ backgroundColor: '#E6E6E6' }}>
      <MDBContainer>
        <MDBRow className="justify-content-center">
          <MDBCol md="9" lg="7" xl="5" className="mt-5">
            <MDBCard style={{ borderRadius: '20px', backgroundColor: '#FFF' }}>
              <MDBCardBody className="p-4 text-black text-center">
                <MDBInputGroup className="mb-2 justify-content-center align-items-center">
                  <MDBInput
                    label="Search"
                    labelClass="text-dark"
                    type="text"
                    value={Name}
                    onChange={(e) => setName(e.target.value)}
                    inputClass="text-dark flex-grow-1 rounded-0"
                    className="border rounded-2"
                  />
                  <MDBBtn color="dark" onClick={handleSearch} className="py-3 px-3 border rounded-7">
                    <MDBIcon fas icon="search" />
                  </MDBBtn>
                </MDBInputGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>

        {selectedResult !== null && (
          <MDBRow className="justify-content-center">
            <MDBCol md="9" lg="7" xl="5" className="mt-5">
              {selectedResult ? (
                <MDBCard style={{ borderRadius: '15px', backgroundColor: '#FFF' }}>
                  <MDBCardBody className="p-4 text-black">
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
                          fluid
                        />
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
                          <MDBBtn outline color="dark" rounded size="sm" className="mx-1" onClick={redirectToProfile}>profile</MDBBtn>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <MDBCardText>{selectedResult['Description']}</MDBCardText>
                    <hr />
                    <MDBBtn
                      color="dark"
                      rounded
                      block
                      size="lg"
                      onClick={() => {
                        if (!invitationSent) {
                          // Only execute the click action when not in "Invitation Sent" state
                          if (isFriend) {
                            DeleteFriend();
                          } else {
                            // Open the modal when adding a contact
                            setModalShow(true);
                          }
                        }
                      }}
                      disabled={invitationSent}
                    >
                      <MDBIcon /> {invitationSent ? "Invitation Sent" : (isFriend ? "- Delete Contact" : "+ Add Contact")}
                    </MDBBtn>


                  </MDBCardBody>
                </MDBCard>
              ) : (
                <div>
                  <MDBTypography tag="h5">No search result found.</MDBTypography>
                </div>
              )}
            </MDBCol>
          </MDBRow>
        )}

        {/* Modal */}
        <MDBModal show={modalShow} tabIndex="-1" onClick={() => setModalShow(false)}>
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalBody onClick={(e) => e.stopPropagation()}>
                <MDBCard style={{ borderRadius: '15px', backgroundColor: '#E6E6E6' }}>
                  <MDBCardBody className="p-4 text-black">
                    <p className="lead fw-normal mb-1">Add Contact</p>
                    <br />
                    <MDBTypography tag="h5" className="mb-2">
                      {Name}
                    </MDBTypography>
                    <br />
                    <label htmlFor="name">Subject :</label>
                    <br />
                    <input
                      type="text"
                      value={Subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                    <br />
                    <br />
                    <MDBBtn
                      color="primary"
                      rounded
                      size="lg"
                      onClick={() => {
                        SendCallForm();
                        setModalShow(false);
                      }}
                    >
                      - Add Contact
                    </MDBBtn>
                  </MDBCardBody>
                </MDBCard>
              </MDBModalBody>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>

      </MDBContainer>
    </div>
  );
}
