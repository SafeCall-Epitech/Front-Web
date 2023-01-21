import React, { useState }  from 'react'
import { Link } from "react-router-dom"
import '../../App.css'
import {
    Nav,
    Navbar,
  } from 'react-bootstrap';
import * as ReactBootStrap from 'react-bootstrap';
import BackgroundImage from '../../assets/images/bg.jpg'
import logoImage from '../../assets/images/SafeCall_logo_white.png'


const Login = ({navigation}) => {

        const [loading, setLoading] = useState(false);
        const [UserName, setUserName] = useState();
        const [Password, setPassword] = useState();
        const Myresponse = fetch('http://20.234.168.103:8080/login/' + UserName + '/' + Password); 


        function getlogin(UserName, Password) {
            setLoading(true);
            Myresponse
            .then((response)=>response.json())
            .then((responseJson) => {
                console.log(responseJson);
                setLoading(false);
                if (responseJson["success"]) {
                    window.location.href = '/homepage';
                } else {
                    alert("Error: Incorrect password or username");
                }
            })
        };
    
   return (
        <div className="text-center">
        <ReactBootStrap.Navbar collapseOnSelect className="color-nav" expand="xl" variant="dark">
        <Navbar.Brand>
            <img src={logoImage} alt="SafeCall Logo" href=""/>
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
        <br />
        <h2>Sign In</h2>
            <form>
                    <label>
                        <p>Username :</p>
                        <input type="username" onChange={e => setUserName(e.target.value)} required/>
                    </label>
                    <br />
                    <label>
                        <p>Password :</p>
                        <input type="password" onChange={e => setPassword(e.target.value)} required/>
                    </label>
                    <p>
                        <button id="sub_btn" type="submit" loading={loading} onClick={() => {getlogin(UserName, Password)}}>Sign In</button>
                    </p>                
                <p>
                    <label>Don't have an account ? <Link to="/register">Sign Up</Link></label>
                </p>
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

export default Login;