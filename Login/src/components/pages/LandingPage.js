import React from 'react'
import { Link } from 'react-router-dom'
import * as ReactBootStrap from "react-bootstrap";
import {
    Nav,
    Navbar,
  } from "react-bootstrap";

import '../../App.css'
import BackgroundImage from '../../assets/images/bg.jpg'
import WelcomeImage from '../../assets/images/welcome.png'
import logoImage from '../../assets/images/SafeCall_logo_white.png'


export default function LandingPage() {
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
            <img src={WelcomeImage} alt="SafeCall Img" class="responsive" />
            <div className="buttons text-center">
                <Link to="/login">
                    <button className="primary-button" id="reg_btn">Sign In</button>
                </Link>
                <Link to="/register">
                    <button className="primary-button" id="reg_btn">Sign Up</button>
                </Link>
            </div>
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