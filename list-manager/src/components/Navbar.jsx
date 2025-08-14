import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>510 ARMY BASE WORKSHOP</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/request">Request</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
