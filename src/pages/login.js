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
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  function getlogin(UserName, Password) {
    setLoading(true);

    const form = JSON.stringify({
      Login: UserName,
      Password: Password
    });

    axios.post(`https://20.234.168.103:8080/login`, form, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        console.log(res.data)
        setLoading(false);
        if (res.data["success"]) {
          localStorage.setItem('user', JSON.stringify(UserName));
          window.location.href = '/';
        } else {
          alert("Error: Incorrect Username or Password");
        }
      });
    // const Myresponse = fetch('https://20.234.168.103:8080/login/' + UserName + '/' + Password)
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     console.log(responseJson);
    //     setLoading(false);
    //     if (responseJson["success"]) {
    //       localStorage.setItem('user', JSON.stringify(UserName));
    //       window.location.href = '/';
    //     } else {
    //       alert("Error: Incorrect Username or Password");
    //     }
    //   })
  };

  return (
    <div>
      {isLoggedIn && <Navbar isLoggedIn={isLoggedIn} />}

      <MDBContainer className="my-5 gradient-form">

        <MDBRow>

          <MDBCol col='6' className="mb-5">
            <div className="d-flex flex-column ms-5">

              <div className="text-center">
                <img src="SafeCallBlack.png" width="250" height="60" alt="Alternate text" />
                <h5 className="mt-1 mb-5 pb-1">Welcome to SafeCall!</h5>
              </div>

              <p>Please login to your account</p>


              <MDBInput wrapperClass='mb-4' label='Username' id='form1' type='username' onChange={e => setUserName(e.target.value)} required />
              <MDBInput wrapperClass='mb-4' label='Password' id='form2' type='password' onChange={e => setPassword(e.target.value)} required />


              <div className="text-center pt-1 mb-5 pb-1">
                <MDBBtn className="mb-4 w-100 gradient-custom-2" onClick={() => { getlogin(UserName, Password) }}>Sign in</MDBBtn>
                <a className="text-muted" href="#!">Forgot password?</a>
              </div>

              <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
                <p className="mb-0">Don't have an account?</p>
                <MDBBtn outline className='mx-2' color='danger'>
                  Create New
                </MDBBtn>
              </div>

            </div>

          </MDBCol>

          <MDBCol col='6' className="mb-5">
            <div className="d-flex flex-column  justify-content-center gradient-custom-2 h-100 mb-4">

              <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                <h4 class="mb-4">Keep your informations Safe with us</h4>
                <p class="small mb-0">SafeCall is a secure alternative to not having to put your phone number on the internet.
                  The principle is simple, we are in partnership with other companies, so instead of putting your
                  phone number when registering, the user can enter their SafeCall ID instead. We will certify
                  the site that you have correctly entered your phone number and will be reachable via the application.
                </p>
              </div>

            </div>

          </MDBCol>

        </MDBRow>

      </MDBContainer>
    </div>

  );
}

export default App;