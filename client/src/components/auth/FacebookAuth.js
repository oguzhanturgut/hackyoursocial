import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import socialConfig from '../../social-config/firebaseConfig';
import { handleLogin } from '../../actions/auth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

if (!firebase.apps.length) {
  firebase.initializeApp(socialConfig);
}

const FacebookAuth = ({ handleLogin, isAuthenticated, accessToken }) => {
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }
  return (
    <div>
      <button className='btn' onClick={() => handleLogin(accessToken)}>
        Login with Facebook
      </button>
    </div>
  );
};

FacebookAuth.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  accessToken: state.auth.token,
});

export default connect(mapStateToProps, { handleLogin })(FacebookAuth);
