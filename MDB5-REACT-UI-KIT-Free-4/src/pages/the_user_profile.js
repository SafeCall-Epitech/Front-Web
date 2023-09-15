import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';

export default function EditButton() {

  const user = JSON.parse(localStorage.getItem('user'));
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Nb, setNb] = useState('');
  const [Description, setDescription] = useState('');
  const { username } = useParams();
  const [ProfilePic, setProfilePic] = useState("https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png");

  var Load = false;

  const fetchData = async () => {
    const res = await axios.get(`http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/profile/${username}`);
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

  const AddFriend = async () => {
    try {
      const form = JSON.stringify({
        UserID: user,
        Friend: Name,
        Action: "add",
      });
      await axios.post(`http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/manageFriend`, form, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      // Update the isFriend variable to indicate that the user is now a friend
      isFriend = true;
    } catch (err) {
      console.error(err);
    }
  };

  

  return (
    <section style={{ top: '0', bottom: '0', right: '0', left: '0', backgroundColor: '#E6E6E6' }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="9" xl="8">
            <MDBCard>
              <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                <div className="ms-4 mt-6 d-flex flex-column" style={{ width: '120px' }}>
                  <MDBCardImage src={ProfilePic}
                    alt="Generic placeholder image" className="mt-4 mb-2 img-thumbnail" fluid style={{ width: '150px', zIndex: '1'}} />
                </div>
                <div className="ms-3" style={{ marginTop: '135px' }}>
                  {Load ? <MDBTypography tag="h5">No Name</MDBTypography>
                    :
                    <MDBTypography tag="h5">{Name}</MDBTypography>
                  }
                  <MDBCardText>@ID</MDBCardText>
                  <MDBBtn color="dark" rounded block size="lg" onClick={AddFriend}>
                    + ADD FRIEND
                  </MDBBtn>
                </div>
              </div>
              <div className="p-4 text-black" style={{ backgroundColor: '#E6E6E6' }}>
                <div className="d-flex justify-content-end text-center py-1">
                </div>
                <div className="mb-5">
                  <p className="lead fw-normal mb-1">About</p>
                  <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                    {Load ? <MDBCardText className="text-muted">
                      None
                    </MDBCardText>
                      :
                      <MDBCardText className="text-muted">
                        {Description}
                      </MDBCardText>
                    }
                  </div>
                </div>
              </div>
              <MDBCardBody className="text-black p-4">
                <p className="lead fw-normal mb-1">Friend's list</p>
                <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                  <MDBCol md="6">
                    <MDBCard className="mb-4 mb-md-0">
                    </MDBCard>
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