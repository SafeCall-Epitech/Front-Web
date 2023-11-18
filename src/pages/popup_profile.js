import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage,
  MDBBtn, MDBTypography, MDBIcon, MDBInputGroup, MDBInput
} from 'mdb-react-ui-kit';

export default function App() {
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Nb, setNb] = useState('');
  const [Description, setDescription] = useState('');
  const [selectedResult, setSelectedResult] = useState(null);
  const [friendsList, setFriendsList] = useState([]);
  const navigate = useNavigate();
  const [ProfilePic, setProfilePic] = useState("https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png");


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    async function fetchFriends() {
      try {
        const response = await axios.get(`/api/listFriends/${user}`);
        const fetchedData = response.data.fetched;
        // console.log(fetchedData);
         const friendsListData = fetchedData.map((name) => ({ name }));
         setFriendsList(friendsListData);
        } catch (error) {
        console.error(error);
      }
    }
    fetchFriends();
  }, []);

  const AddFriend = async () => {
    try {
      const form = JSON.stringify({
        UserID: user,
        Friend: Name,
        Action: "add",  // assuming you want to send the string "add"
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/profile/${user}`);        
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
                      <p className="small mb-0"><MDBIcon far icon="clock me-2" />6 hrs ago</p>
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
                    <MDBBtn color="dark" rounded block size="lg" onClick={AddFriend}>

                      <MDBIcon /> + Add Friend
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
      </MDBContainer>
    </div>
  );
}

