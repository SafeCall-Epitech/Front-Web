import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';

import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBIcon,
  MDBTypography,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalBody,
} from 'mdb-react-ui-kit';

export default function EditButton() {

  const [invitationSent, setInvitationSent] = useState(false); // State variable to track invitation status
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const user = JSON.parse(localStorage.getItem('user'));
  const [friendsList, setFriendsList] = useState([]);
  const isFriend = friendsList.some((friend) => friend.name === Name);
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Nb, setNb] = useState('');
  const [Description, setDescription] = useState('');
  const { username } = useParams();
  const [ProfilePic, setProfilePic] = useState(
    'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png'
  );
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [Subject, setSubject] = useState('');
  var Load = false;

  const fetchData = async () => {
    const res = await axios.get(
      `http://20.234.168.103:8080/profile/${username}`
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
      date: selectedDate.toISOString(),
      time: selectedTime,
    });

    axios
      .post(`http://20.234.168.103:8080/addEvent`, form, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        console.log(res.data);
        setModalShow(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const DeleteFriend = async () => {
    try {
      const form = JSON.stringify({
        UserID: user,
        Friend: Name,
        Action: "rm",
      });
      await axios.post(`http://20.234.168.103:8080/manageFriend`, form, {
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
    navigate(`/My_user_profile/${username}`);

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

                  <div className="ms-3" style={{ marginTop: '130px' }}>
                    {Load ? <MDBTypography tag="h5">No Name</MDBTypography> : <MDBTypography tag="h5">{Name}</MDBTypography>}
                    <MDBCardText>@ID</MDBCardText>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <MDBBtn
                        color="dark"
                        rounded
                        size="lg"
                        onClick={() => {
                          DeleteFriend();
                        }}
                      >
                        <MDBIcon /> {"- Delete Contact"}
                      </MDBBtn>
                      <MDBBtn color="light" rounded size="lg" onClick={() => setModalShow(true)}>
                        BOOK A CALL
                      </MDBBtn>
                    </div>
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
                                  backgroundColor: '#007bff',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '10px 20px',
                                  borderRadius: '5px',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.3s ease',
                                }}
                              />
                              <br />
                              <br />
                              <label htmlFor="time">Time:</label>
                              <br />
                              <TimePicker
                                onChange={setSelectedTime}
                                value={selectedTime}
                                format="h:mm a"
                                clearIcon={null}
                                clockIcon={null}
                                disableClock={true}
                                style={{
                                  backgroundColor: '#007bff',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '10px 20px',
                                  borderRadius: '5px',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.3s ease',
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
                <p className="lead fw-normal mb-1">Contact's list</p>
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
