import React, { useState, useEffect } from 'react';
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
  MDBListGroup,
  MDBListGroupItem
} from 'mdb-react-ui-kit';
import axios from 'axios';

export default function ProfilePage() {

  const user = JSON.parse(localStorage.getItem('user'));

  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Nb, setNb] = useState('');
  const [Description, setDescription] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(Name);
  const [newEmail, setNewEmail] = useState(Email);
  const [newNb, setNewNb] = useState(Nb);
  const [newDescription, setNewDescription] = useState(Description);

  const [friendsList, setFriendsList] = useState([]);

  useEffect(() => {
    const fetchFriendsList = async () => {
      try {
        const response = await axios.get(`http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/listFriends/${user}`);
        const fetchedData = response.data.fetched;
        const friendsListData = fetchedData.map((name) => ({ name }));
        setFriendsList(friendsListData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFriendsList();
  }, []);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  };

  const handleNbChange = (e) => {
    setNewNb(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setNewDescription(e.target.value);
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/profile/${user}`, {
        FullName: newName,
        Email: newEmail,
        PhoneNb: newNb,
        Description: newDescription
      });
      console.log(res.data);
      setName(newName);
      setEmail(newEmail);
      setNb(newNb);
      setDescription(newDescription);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewName(Name);
    setNewEmail(Email);
    setNewNb(Nb);
    setNewDescription(Description);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/profile/${user}`);
        setName(res.data['profile']['FullName']);
        setEmail(res.data['profile']['Email']);
        setNb(res.data['profile']['PhoneNb']);
        setDescription(res.data['profile']['Description']);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <section style={{ top: '0', bottom: '0', right: '0', left: '0', backgroundColor: '#E6E6E6' }}>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: '170px' }}
                  fluid
                />

                <MDBCardText>{Name}</MDBCardText>
                <p className="@ID : *******">@ID : *******</p>
                <div className="d-flex justify-content-center mb-2">
                  <MDBBtn color="dark" rounded block size="mg" onClick={() => setIsEditing(true)}>
                    <MDBIcon far icon="cog" /> Modify
                  </MDBBtn>
                </div>


                  {user && (
                    <MDBBtn color="danger" rounded block size="mg" className="me-2" onClick={() => {
                      const confirmed = window.confirm('Are you sure you want to disconnect?');
                      if (confirmed) {
                        localStorage.removeItem('user');
                        window.location.href = '/Login';
                      }
                    }}>
                      <MDBIcon fas icon="sign-out-alt" /> Disconnect
                    </MDBBtn>
                  )}


              </MDBCardBody>
            </MDBCard>

            <MDBCard className="mb-4 mb-lg-0">
              <MDBCardBody>
                <MDBCardText className="mb-4">
                  <span className="text-primary font-italic me-1">Description</span>
                </MDBCardText>

                <MDBCardText className="text-muted">{Description}</MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Full Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    {isEditing ? (
                      <div className="d-flex justify-content-start mb-2">
                        <input type="text" value={newName} onChange={handleNameChange} />
                      </div>
                    ) : (
                      <MDBCardText className="text-muted">{Name}</MDBCardText>
                    )}
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>ID SafeCall</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">MyIdTest</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    {isEditing ? (
                      <div className="d-flex justify-content-start mb-2">
                        <input type="text" value={newEmail} onChange={handleEmailChange} />
                      </div>
                    ) : (
                      <MDBCardText className="text-muted">{Email}</MDBCardText>
                    )}
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Phone Number</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    {isEditing ? (
                      <div className="d-flex justify-content-start mb-2">
                        <input type="text" value={newNb} onChange={handleNbChange} />
                      </div>
                    ) : (
                      <MDBCardText className="text-muted">{Nb}</MDBCardText>
                    )}
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Password</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">********</MDBCardText>
                  </MDBCol>
                </MDBRow>

                {isEditing && (
                  <div className="d-flex justify-content-center mt-4">
                    <MDBBtn color="black" className="me-4" onClick={handleSave}>
                      Save
                    </MDBBtn>
                    <MDBBtn color="warning" onClick={handleCancel}>
                      Cancel
                    </MDBBtn>
                  </div>
                )}
              </MDBCardBody>
            </MDBCard>

            <MDBRow>
              <MDBCol sm="6">
                <MDBCard className="mb-4">
                  <MDBCardBody>
                    <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">My Appointments</span></MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>

              <MDBCol sm="6">
                <MDBCard className="mb-4">
                  <MDBCardBody>
                    <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">Friends List</span></MDBCardText>
                    <MDBListGroup>
                      {friendsList.map((friend) => (
                        <MDBListGroupItem key={friend.id}>
                          {friend.name}
                        </MDBListGroupItem>
                      ))}
                    </MDBListGroup>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section >
  );
}