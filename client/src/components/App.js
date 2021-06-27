import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomePage from './home/landingPage';
import EditPage from './edit/landingPage';
import Navbar from './Navbar';
import Login from './login/Login';
import Register from './register/Register';
import './style.css';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="/edit/:documentId" exact component={EditPage} />
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default App;
