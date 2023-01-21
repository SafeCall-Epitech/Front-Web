import React from 'react'
import { Link } from 'react-router-dom'
import * as ReactBootStrap from "react-bootstrap";
import {
    Nav,
    Navbar,
  } from "react-bootstrap";

import BackgroundImage from '../../assets/images/bg.jpg'
import logoImage from '../../assets/images/SafeCall_logo_white.png'

import '../../App.css'

export default function SignUpPage() {
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
        <br />
            <h2>Let's find your SafeCall account</h2>
            <form action="/login">
                <p>
                    <label id="reset_pass_lbl">Email adress</label><br/>
                    <input type="email" name="email" required />
                </p>
                <p>
                    <button id="sub_btn" type="submit">Reinitialize password</button>
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