import React from 'react'
import { Link } from 'react-router-dom'
import * as ReactBootStrap from "react-bootstrap";
import {
  Nav,
  Navbar,
} from 'react-bootstrap';
import BackgroundImage from '../../assets/images/bg.jpg'
import logoImage from '../../assets/images/SafeCall_logo_white.png'
import Footer from "./Footer"

export default function HomePage() {
    return (
//     <div className="text-center">
//     <ReactBootStrap.Navbar collapseOnSelect expand="xl" bg="dark" variant="dark">
//     <ReactBootStrap.Navbar.Brand href="/homepage">SafeCall</ReactBootStrap.Navbar.Brand>
//     <ReactBootStrap.Navbar.Toggle aria-controls="responsive-navbar-nav" />
//     <ReactBootStrap.Navbar.Collapse id="responsive-navbar-nav">
//     <Link to="/">
//     <ReactBootStrap.Nav.Link href="#profil">My Profil</ReactBootStrap.Nav.Link>
//     </Link>
//     <Link to="/">Log Out</Link>
//     <ReactBootStrap.Nav>
//     </ReactBootStrap.Nav>
//     </ReactBootStrap.Navbar.Collapse>
//     </ReactBootStrap.Navbar>
//     <h1 className="main-title text-center">A L'AIDE</h1>
//     <div className="page-container">
//       <div className="content-wrap">
//         <h1>Contact 1</h1>
//         <h1>Contact 2</h1>
//         <h1>Contact 3</h1>
//         <h1>Contact 4</h1>
//         <h1>Contact 5</h1>
//         <h1>Contact 6</h1>
//         <h1>Contact 7</h1>
//         <h1>Contact 8</h1>
//         <h1>Contact 9</h1>
//       </div>
//       <Footer />
//     </div>

//     </div>
//     )
// }
        <div className="text-center">
        <ReactBootStrap.Navbar collapseOnSelect className="color-nav" expand="xl" variant="dark">
        <Navbar.Brand>
           <img src={logoImage} alt="SafeCall Logo" href="/"/>
        </Navbar.Brand>
        <ReactBootStrap.Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <ReactBootStrap.Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
        {/* <Link to="https://www.google.com/"> */}
            <ReactBootStrap.Nav.Link href="https://www.google.com/">Profile</ReactBootStrap.Nav.Link>
        {/* </Link> */}
        <Link to="/">
            <ReactBootStrap.Nav.Link href="/">Log Out</ReactBootStrap.Nav.Link>
        </Link>
        </Nav>
        <ReactBootStrap.Nav>
        </ReactBootStrap.Nav>
        </ReactBootStrap.Navbar.Collapse>
        </ReactBootStrap.Navbar>
        <header style={ HeaderStyle }>
        <br />
        <br />
        <div className="content-wrap">
        <h1>Launch a SafeCall</h1>
          <div class="wrap">
          <div class="search">
          <input type="text" class="searchTerm" placeholder="Enter a SafeCall user"/>
          <button type="submit" class="searchButton">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
          <i class="fa fa-search"></i>
          </button>
        </div>
        </div>
         </div>
          </header>
          <Footer />
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