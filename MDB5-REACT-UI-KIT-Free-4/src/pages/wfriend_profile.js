import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalBody,
} from 'mdb-react-ui-kit';

export default function EditButton() {
  const [selectedDate, setSelectedDate] = useState(new Date()); // Change variable name to selectedDate
  const user = JSON.parse(localStorage.getItem('user'));
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Nb, setNb] = useState('');
  const [Description, setDescription] = useState('');
  const { username } = useParams();
  const [friendsList, setFriendsList] = useState([]);
  const [ProfilePic, setProfilePic] = useState(
    'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png'
  );
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  // CALL FORM
  const [Guest1, setGuest1] = useState('');
  const [Guest2, setGuest2] = useState('');
  const [Subject, setSubject] = useState('');

  var Load = false;

  const fetchData = async () => {
    const res = await axios.get(
      `http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/profile/${username}`
    );
    setName(res.data['profile']['FullName']);
    setEmail(res.data['profile']['Email']);
    setNb(res.data['profile']['PhoneNb']);
    setDescription(res.data['profile']['Description']);
    setProfilePic(res.data['profile']['ProfilePic']);
    Load = false;
  };

  useEffect(() => {
    fetchData();
  }, [username]);

  const SendCallForm = async () => {
    const form = JSON.stringify({
      guest1: user,
      guest2: username,
      subject: Subject,
      date: selectedDate.toISOString(), // Use selectedDate
    });
    axios
      .post(`http://20.234.168.103:8080/addEvent`, form, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        console.log(res.data);
        setModalShow(false); // Close the modal after sending the form.
      })
      .catch((error) => {
        console.error(error); // Handle any errors here if necessary.
      });
  };

  const DeleteFriend = async (event, friendName, index) => {
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      const form = JSON.stringify({
        UserID: user,
        Friend: friendName,
        Action: 'rm',
      });
      const response = await axios.post(
        `http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/manageFriend`,
        form,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
    const isFriend = friendsList.some((friend) => friend.name === Name);

    if (isFriend != friendsList.includes(Name)) {
      navigate(`/My_user_profile/${Name}`);
    }

    async function fetchFriends() {
      try {
        const response = await axios.get(
          `http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/listFriends/${user}`
        );
        const fetchedData = response.data.fetched;
        const friendsListData = fetchedData.map((name) => ({ name }));
        setFriendsList(friendsListData);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <section style={{ top: '0', bottom: '0', right: '0', left: '0', backgroundColor: '#E6E6E6' }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="9" xl="8">
            <MDBCard>
              <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                  <MDBCardImage
                    src={ProfilePic}
                    alt="Generic placeholder image"
                    className="mt-4 mb-2 img-thumbnail"
                    fluid
                    style={{ width: '150px', zIndex: '1' }}
                  />
                </div>

                <div className="ms-3" style={{ marginTop: '135px' }}>
                  {Load ? <MDBTypography tag="h5">No Name</MDBTypography> : <MDBTypography tag="h5">{Name}</MDBTypography>}
                  <MDBCardText>@ID</MDBCardText>

                  <MDBBtn color="dark" rounded size="lg" onClick={DeleteFriend}>
                    - DELETE FRIEND
                  </MDBBtn>
                  <button type="button" class="btn btn-outline-dark" data-mdb-ripple-color="dark">
                    Dark
                  </button>
                  <button type="button" class="btn btn-outline-dark" data-mdb-ripple-color="light">
                    Dark
                  </button>
                  <button type="button" class="btn btn-outline-dark" data-mdb-ripple-color="light">
                    Dark
                  </button>

                  <MDBBtn color="light" rounded size="lg" onClick={() => setModalShow(true)}>
                    BOOK A CALL
                  </MDBBtn>
                  <MDBModal show={modalShow} tabIndex="-1" onClick={() => setModalShow(false)}>
                    <MDBModalDialog>
                      <MDBModalContent>
                        <MDBModalBody onClick={(e) => e.stopPropagation()}>
                          <MDBCard style={{ borderRadius: '15px', backgroundColor: '#E6E6E6' }}>
                            <MDBCardBody className="p-4 text-black">
                              <p className="lead fw-normal mb-1">Call Form</p>
                              <br />

                              <MDBTypography tag="h5" className="mb-2">
                                To {username}
                              </MDBTypography>
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
                              <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                dateFormat="dd/MM/yyyy"
                                style={{
                                  backgroundColor: '#007bff', // Change the background color to your desired color
                                  color: '#fff', // Text color
                                  border: 'none',
                                  padding: '10px 20px', // Adjust padding as needed
                                  borderRadius: '5px', // Add rounded corners
                                  cursor: 'pointer',
                                  transition: 'background-color 0.3s ease', // Add a smooth transition effect
                                }}
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
                                - Send Form
                              </MDBBtn>
                            </MDBCardBody>
                          </MDBCard>
                        </MDBModalBody>
                      </MDBModalContent>
                    </MDBModalDialog>
                  </MDBModal>
                </div>
              </div>

              <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="d-flex justify-content-end text-center py-1"></div>
                <div className="mb-5">
                  <p className="lead fw-normal mb-1">About</p>
                  <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                    {Load ? (
                      <MDBCardText className="text-muted">None</MDBCardText>
                    ) : (
                      <MDBCardText className="text-muted">{Description}</MDBCardText>
                    )}
                  </div>
                </div>
              </div>
              <MDBCardBody className="text-black p-4">
                <p className="lead fw-normal mb-1">Friend's list</p>
                <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                  <MDBCol md="6">
                    <MDBCard className="mb-4 mb-md-0"></MDBCard>
                  </MDBCol>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
