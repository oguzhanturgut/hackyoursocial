import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { handleLoginFacebook, handleLoginGoogle } from "../../actions/auth";
import {
  FacebookLoginButton,
  GoogleLoginButton
} from "react-social-login-buttons";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "../../social-config/firebaseConfig";

const Landing = ({
  isAuthenticated,
  handleLoginFacebook,
  handleLoginGoogle,
  accessToken
}) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Developer Connector</h1>
          <p className="lead">
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </p>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-light">
              Login
            </Link>
          </div>
          <FacebookLoginButton
            onClick={() => handleLoginFacebook(accessToken)}
            style={{ fontSize: "1rem", width: "13rem" }}
          />
          <GoogleLoginButton
            onClick={() => handleLoginGoogle(accessToken)}
            style={{ width: "13rem" }}
          />
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
  handleLoginFacebook: PropTypes.func.isRequired,
  handleLoginGoogle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  accessToken: state.auth.token
});

export default connect(mapStateToProps, {
  handleLoginFacebook,
  handleLoginGoogle
})(Landing);
