import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  login,
  handleLoginFacebook,
  handleLoginGoogle
} from "../../actions/auth";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "../../social-config/firebaseConfig";

const Login = ({
  login,
  isAuthenticated,
  handleLoginFacebook,
  handleLoginGoogle,
  accessToken
}) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    login(email, password);
  };

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign Into Your Account
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={e => onChange(e)}
            required
          />
        </div>

        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={e => onChange(e)}
            minLength='6'
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Login' />
      </form>
      <p className='my-1'>
        <Link to='/email-password'>Forgot password?</Link>
      </p>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
      <button className='btn' onClick={() => handleLoginFacebook(accessToken)}>
        <i className='fab fa-facebook-f'></i> Sign In with Facebook
      </button>
      <button
        className='btn btn-email'
        onClick={() => handleLoginGoogle(accessToken)}
      >
        <i className='fas fa-envelope'></i> Sign In with Google
      </button>
    </Fragment>
  );
};

login.propTypes = {
  login: PropTypes.func.isRequired,
  handleLoginFacebook: PropTypes.func.isRequired,
  handleLoginGoogle: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  accessToken: state.auth.token
});

export default connect(mapStateToProps, {
  login,
  handleLoginFacebook,
  handleLoginGoogle
})(Login);
