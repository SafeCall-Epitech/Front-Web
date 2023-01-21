import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as ReactBootStrap from 'react-bootstrap'
import {
    Nav,
    Navbar,
  } from 'react-bootstrap';
import BackgroundImage from '../../assets/images/bg.jpg'
import logoImage from '../../assets/images/SafeCall_logo_white.png'
import '../../App.css'
import axios from 'axios';

const Register = ({navigation}) => {

    const [loading, setLoading] = useState(false);
    const [UserName, setUserName] = useState();
    const [setEmail] = useState();
    const [Password, setPassword] = useState();

    function register(UserName, Password) {
        setLoading(true);
        axios.post('http://20.234.168.103:8080/register/' + UserName + '/' + Password)
        .then(res => {
            console.log(res.data);
            setLoading(false);
            if (res.data["success"]) {
                alert("You're account has been registered, please login");
            } if (res.data["failed"]) {
                alert ("Error: " + res.data["failed"]);
            }
        })
    };

    return (
        <div className="text-center">
        <ReactBootStrap.Navbar collapseOnSelect className="color-nav" expand="xl" variant="dark">
        <Navbar.Brand>
           <img src={logoImage} alt="SafeCall Logo" href="/"/>
        </Navbar.Brand>
        <ReactBootStrap.Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <ReactBootStrap.Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
        <Link to="/login">
            <ReactBootStrap.Nav.Link href="/login">Sign In </ReactBootStrap.Nav.Link>
        </Link>
        <Link to="/register">
            <ReactBootStrap.Nav.Link href="/register">Sign Up </ReactBootStrap.Nav.Link>
        </Link>
        </Nav>
        <ReactBootStrap.Nav>
        </ReactBootStrap.Nav>
        </ReactBootStrap.Navbar.Collapse>
        </ReactBootStrap.Navbar>
        <header style={ HeaderStyle }>
        <br />
        <br />
        <br/>
        <h2>Sign Up</h2>
                <form>
                    <label>
                        <p>Username :</p>
                        <input type="username"  onChange={e => setUserName(e.target.value)} required/>
                    </label>
                    <br />
                    <label>
                        <p>Email :</p>
                        <input type="email" onChange={e => setEmail(e.target.value)}/>
                    </label>
                    <br />
                    <label>
                        <p>Password :</p>
                        <input type="password" onChange={e => setPassword(e.target.value)} required/>
                    </label>
                    <br />
                    <p>
                        <input type="checkbox" name="checkbox" id="checkbox" required /> <span>I agree all statements in <a href="https://google.fr" target="_blank" rel="noopener noreferrer">terms of service</a></span>.
                    </p>
                    <p>
                        <button id="sub_btn" type="submit" loading={loading} onClick={() => {register(UserName, Password)}}>Sign Up</button>
                    </p>
                    <label>Already have an account ? <Link to="/login">Sign In</Link></label>
                </form>
            </header>
        </div>
    )
}

const HeaderStyle = {
    width: "100%",
    height: "100vh",
    background: `url(${BackgroundImage})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
}

export default Register;