import React, { useEffect, useRef, useState } from 'react';
import loginImage from '../images/login.svg';
import { Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import axios from 'axios';

const Register = () => {
  const history = createBrowserHistory({ forceRefresh: true });
  const refHistory = useRef(createBrowserHistory({ forceRefresh: true }));

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.post(
        '/isAuth',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (res.data === 'yes') {
        refHistory.current.push('/');
      }
    };
    fetchData();
  }, []);

  const [details, setDetails] = useState({
    name: '',
    username: '',
    password: '',
    rpassword: '',
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleClick = async () => {
    const res = await axios.post('/register', JSON.stringify(details), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.data === 'success') {
      history.push('/');
    } else {
      alert(res.data);
    }
  };

  return (
    <div className="register">
      <div className="register-inner">
        <div className="register-image">
          <img src={loginImage} alt="login" />
        </div>
        <div className="register-box">
          <h1 className="login-heading">Register</h1>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={details.name}
            placeholder="Name"
          />
          <input
            type="text"
            name="username"
            onChange={handleChange}
            value={details.username}
            placeholder="Username"
          />
          <input
            type="text"
            name="password"
            onChange={handleChange}
            value={details.password}
            placeholder="Password"
          />
          <input
            type="text"
            name="rpassword"
            onChange={handleChange}
            value={details.rpassword}
            placeholder="Repeat Password"
            className="less-margin"
          />
          <button className="extra-width" onClick={handleClick}>
            Register
          </button>
          <p>
            Already have an account <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;
