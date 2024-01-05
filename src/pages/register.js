import React, { useState } from 'react'
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput
}
  from 'mdb-react-ui-kit';
import { Link } from "react-router-dom"

function App() {

  const [loading, setLoading] = useState(false);
  const [UserName, setUserName] = useState();
  const [Password, setPassword] = useState();
  const [Email, setEmail] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function getregister(UserName, Password, Email) {
    setLoading(true);
    const form = JSON.stringify({
      Login: UserName,
      Password: Password,
      Email: Email,
  });
  axios.post(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/register`, form, {
      headers: {
          'Content-Type': 'application/json',
      }
  })
        .then((responseJson) => {
        setLoading(false);
        window.location.href = '/login';
      })
  };

  return (
    <div>
      {isLoggedIn && <Navbar isLoggedIn={isLoggedIn} />}

      <MDBContainer className="my-5" style={{ backgroundColor: 'white', borderRadius: '25px' }}>
        <MDBRow>
          <MDBCol col='6' className="mb-5">
            <div className="d-flex flex-column ms-2"> 
              <div className="text-center">
                <img src="SafeCallBlack.png" width="250" height="60" alt="Alternate text" />
                <h5 className="mt-1 mb-5 pb-1">Welcome to SafeCall!</h5>
              </div>

              <h5 className="mt-1 pb-1">Sign up for an account</h5>

              <MDBInput wrapperClass='mb-4' label='Username' id='form1' type='username' onChange={e => setUserName(e.target.value)} required />
              <MDBInput wrapperClass='mb-4' label='Password' id='form2' type='password' onChange={e => setPassword(e.target.value)} required />
              <MDBInput wrapperClass='mb-4' label='Mail' id='form1' type='email' onChange={e => setEmail(e.target.value)} required />

              <div className="text-center pt-1 pb-1">
                <MDBBtn className="mb-4 w-100" style={{
                  backgroundColor: 'black',
                  borderRadius: '25px',
                  color: 'white',
                  }}
                  onClick={() => { getregister(UserName, Password, Email) }}>
                  Sign Up
                </MDBBtn>
              </div>

              <div className="d-flex flex-row align-items-center justify-content-center pb-4">
                <p className="mb-0">Already have an account ?&nbsp;</p>
                <span
                  onClick={() => {
                      window.location.href = '/login';
                  }}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                  Sign In
                </span>
              </div>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default App;
