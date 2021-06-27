import React, { useState } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn] = useState(false);
  const [details] = useState('Arya Anish');

  return (
    <div className="navbar">
      <div className="menu-button">
        <MenuIcon />
        <h1>Arocs</h1>
      </div>
      <div className="search-bar">
        <SearchIcon fontSize="small" />
        <input type="text" placeholder="Search" name="search" />
      </div>
      <Link to="/login" className="menu-account">
        {isLoggedIn ? details.substring(0, 1).toUpperCase() : 'A'.toUpperCase()}
      </Link>
    </div>
  );
};

export default Navbar;
