import React, { useEffect, useState, useContext } from "react";
import { logout } from "../redux/apiCalls";
import { Link } from "react-router-dom";

import M from "materialize-css/dist/js/materialize.min.js";
import { useDispatch, useSelector } from "react-redux";



export default function NavBar() {
  // Initialize sidebar
  useEffect(() => {
    let elem = document.querySelector(".sidenav");
    let instance = M.Sidenav.init(elem, {
      edge: "left",
      inDuration: 250,
    });
  }, []);
  
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const handleLogout = (e) => {
    e.preventDefault();
    logout(dispatch);
  };
  
  return (
    <>
      <nav className="green darken-5">
        <div className="nav-wrapper container">
          <span className="brand-logo">
            <Link to="/">Paste_Bin</Link>
            <i className="large material-icons">rss_feed</i>
          </span>
          <a href="/" data-target="mobile-sidebar" className="sidenav-trigger">
            <i className="material-icons">menu</i>
          </a>
          <ul className="right hide-on-med-and-down">
            <li>
              <Link to="/">New Paste</Link>
            </li>
            <li>
              <Link to="/latest">Latest Pastes</Link>
            </li>
            {user ? (
          <li>
          <Link to="/" onClick={handleLogout}>
            LOGOUT
          </Link>
          </li>
        ) : (
         <>
          <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        </>
        )}
          </ul>
        </div>
      </nav>

      <ul className="sidenav sidenav-close" id="mobile-sidebar">
        <li>
          <div className="user-view">
            <div className="drawer-background" style={{ height: "35px" }}>
              <h5>RSS Reader</h5>
            </div>
          </div>
        </li>
        <li>
          <Link to="/">New Paste</Link>
        </li>
        <li>
          <Link to="/latest">Latest Pastes</Link>
        </li>
        {user ? (
          <li onClick={handleLogout}>
          <Link to="/">
            LOGOUT
          </Link>
          </li>
        ) : (
         <>
          <li>
          <Link to="/Login">Login</Link>
        </li>
        <li>
          <Link to="/Register">Register</Link>
        </li>
        </>
        )}
        
      </ul>
    </>
  );
}
