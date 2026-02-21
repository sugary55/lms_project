import React from "react";
import './navbar.css';

const Navbar = ({User, handleLogout,handleLogin})=>{
  return (
    <nav className="navbar">
      <div className="navbar-logo" >
        <strong>DR.Mina academy</strong>
      </div>
      <ul className="navbar-links">
        <li><a href="#courses">courses</a></li>
        <li><a href="#about">about</a></li>
        <li><a href="#support">support</a></li>
      </ul>
      <div className="navbar-auth">
        {User ? (
          <div className="user-section">
            <span className="user-email">{User.email}</span>
            <button className="logout-btn" onClick={handleLogout}>logout</button>
          </div>
        ) :(
          <button className="login-btn" onClick={handleLogin}>login with google</button>
        )}

     
      </div>
    </nav>
  );
};

export default Navbar;