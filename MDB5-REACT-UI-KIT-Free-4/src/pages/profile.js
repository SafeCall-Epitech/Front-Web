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

    const [Name, setName] = useState('');
    const [Email, setEmail] = useState('');
    const [Nb, setNb] = useState('');
    const [Description, setDescription] = useState('');

    var Load = false;

      const fetchData = async () => {
        const res = await axios.get(`http://x2024safecall3173801594000.westeurope.cloudapp.azure.com:8080/profile/Alabama`);
        setName(res.data['profile']['FullName']);
        setEmail(res.data['profile']['Email']);
        setNb(res.data['profile']['PhoneNb']);
        setDescription(res.data['profile']['Description']);

        Load = false;
      };
      fetchData();

  return (
    <section style={{top:'0', bottom:'0', right:'0', left:'0',  backgroundColor: '#E6E6E6'}}>
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
                  fluid />

                  {Load ? <MDBCardText>
                    None
                    </MDBCardText>
                    :
                    <MDBCardText>
                    {Name}
                    </MDBCardText>
                  }

                <p className>@ID : *******</p>
                <div className="d-flex justify-content-c  enter mb-2">
                  <MDBBtn color="dark" rounded block size="mg">
                  <MDBIcon  far icon="cog" /> Modify</MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>

            <MDBCard className="mb-4 mb-lg-0">
            <MDBCardBody>
            <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">Description</span></MDBCardText>      

                {Load ? <MDBCardText className="text-muted">
                None
                </MDBCardText>
                :
                <MDBCardText className="text-muted">
                {Description}
                </MDBCardText>
                }
                
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

                    {Load ? <MDBCardText className="text-muted">
                    None
                    </MDBCardText>
                    :
                    <MDBCardText className="text-muted">
                    {Name}
                    </MDBCardText>
                    }

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
                    
                  {Load ? <MDBCardText className="text-muted">
                    None
                    </MDBCardText>
                    :
                    <MDBCardText className="text-muted">
                    {Email}
                    </MDBCardText>
                    }

                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Phone Number</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">

                  {Load ? <MDBCardText className="text-muted">
                    None
                    </MDBCardText>
                    :
                    <MDBCardText className="text-muted">
                    {Nb}
                    </MDBCardText>
                    }

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
              </MDBCardBody>
            </MDBCard>

            <MDBRow>
              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody>
                    <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">My Appointments</span></MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>

              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody>
                    <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">Friends List</span></MDBCardText>
                   
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
