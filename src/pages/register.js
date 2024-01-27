import React, { useState } from 'react';
import axios from 'axios';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBInput } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

function App() {
  const [loading, setLoading] = useState(false);
  const [UserName, setUserName] = useState('');
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [Email, setEmail] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [userVisibleError, setUserVisibleError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleUserName = (value) => {
    setUserName(value);
    setUserVisibleError('');
    if (value.length < 5) {
      setUserVisibleError('Username must be at least 5 characters');
    }
  };
  
  const handlePassword = (value) => {
    setPassword(value);
    setPasswordError('');
    setUserVisibleError('');
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    if (!passwordRegex.test(value)) {
      setPasswordError('Password must be at least 8 characters, with at least one uppercase letter, one numeric digit, and one special symbol.');
      setUserVisibleError('Password must be at least 8 characters, with at least one uppercase letter, one numeric digit, and one special symbol.');
    }
  };

  const handleConfirmPassword = (value) => {
    setConfirmPassword(value);
    setPasswordError('');
    setUserVisibleError('');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmail = (value) => {
    setEmail(value);
    setEmailError(validateEmail(value) ? '' : 'Invalid email format');
    setUserVisibleError('');
  };

  function getregister() {
    setLoading(true);
    if (Password !== ConfirmPassword) {
      setLoading(false);
      setPasswordError("Passwords don't match");
      setUserVisibleError("Passwords don't match");
      return;
    }

    if (!validateEmail(Email)) {
      setLoading(false);
      setEmailError('Invalid email format');
      setUserVisibleError('Invalid email format');
      return;
    }

    if (passwordError) {
      setLoading(false);
      setUserVisibleError(passwordError);
      return;
    }

    const form = JSON.stringify({
      Login: UserName,
      Password: Password,
      Email: Email,
    });

    axios
      .post(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/register`, form, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((responseJson) => {
        setLoading(false);
        window.location.href = '/login';
      })
      .catch((error) => {
        setLoading(false);
        setUserVisibleError('Registration failed. Please try again.');
        console.error('Registration failed:', error);
      });
  }

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

              <MDBInput
                wrapperClass='mb-4' label='Username' id='form1' type='username' onChange={(e) => handleUserName(e.target.value)} required
                className={usernameError ? 'is-invalid' : ''}
              />
              {usernameError && (
                <div className='invalid-feedback'>{usernameError}</div>
              )}

              <MDBInput
                wrapperClass='mb-4' label='Password' id='form2' type='password' onChange={(e) => handlePassword(e.target.value)} required
                className={passwordError ? 'is-invalid' : ''}
              />
              {passwordError && (
                <div className='invalid-feedback'>{passwordError}</div>
              )}

              <MDBInput
                wrapperClass='mb-4' label='Confirm Password' id='form3' type='password' onChange={(e) => handleConfirmPassword(e.target.value)} required
                className={passwordError ? 'is-invalid' : ''}
              />
              {passwordError && (
                <div className='invalid-feedback'>{passwordError}</div>
              )}

              <MDBInput
                wrapperClass='mb-4' label='Mail' id='form4' type='email' onChange={(e) => handleEmail(e.target.value)} required
                className={emailError ? 'is-invalid' : ''}
              />
              {emailError && (
                <div className='invalid-feedback'>{emailError}</div>
              )}
              {userVisibleError && (
                <div className='text-danger'>{userVisibleError}</div>
              )}

              <div className="text-center pt-1 pb-1">
                <MDBBtn
                  className="mb-4 w-100"
                  style={{
                    backgroundColor: 'black',
                    borderRadius: '25px',
                    color: 'white',
                  }}
                  onClick={() => { getregister(UserName, Password, ConfirmPassword, Email) }}
                >
                  Sign Up
                </MDBBtn>
              </div>

              <div className="d-flex flex-row align-items-center justify-content-center pb-4">
                <p className="mb-0">Already have an account ?&nbsp;</p>
                <span
                  onClick={() => {
                    window.location.href = '/login';
                  }}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
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
