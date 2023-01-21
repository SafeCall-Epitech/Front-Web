import React from "react";
import { Link } from 'react-router-dom'
import "./Footer.css";

function Footer() {
  return (
    <div className="main-footer">
      <div className="container">
        <div className="row">
          <p className="col-sm">
            &copy;{new Date().getFullYear()} SAFECALL | All rights reserved |
            <Link to="/terms">Terms Of Service</Link> | <Link to="/privacy">Privacy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;