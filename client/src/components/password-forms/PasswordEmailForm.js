import React, { Fragment, useState } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";

const PasswordEmailForm = ({ setAlert, isAuthenticated }) => {
  const [formData, setFormData] = useState({});
  const [sent, setSent] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const onChange = e => setFormData({ ...formData, email: e.target.value });
  const onSubmit = async e => {
    try {
      e.preventDefault();

      //  send email
      const reqConfig = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      const reqBody = JSON.stringify({ email: formData.email });
      setShowSpinner(true);
      await axios.put(`/api/auth/forgot-password/`, reqBody, reqConfig);
      setShowSpinner(false);
      setSent(true);
    } catch (err) {
      console.error(err);
    }
  };
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  if (!sent && showSpinner) {
    return (
      <Fragment>
        <p className='my-1'>Sending mail, please wait... </p>
        <p>
          <Spinner />
        </p>
      </Fragment>
    );
  }

  if (sent && !showSpinner) {
    // return <Redirect to='/login' />;
    setAlert("Email sent", "success");

    return (
      <Fragment>
        <h1 className='large text-primary'>Rest password emial is sent.</h1>
        <p className='lead'>
          <i className='fas fa-mail'></i> Check your emial: {formData.email}
        </p>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Forgot Password</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Input Your Email And Submit To Send
        Recovery Email
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            onChange={e => onChange(e)}
            required
          />
        </div>

        <input type='submit' className='btn btn-primary' value='Send' />
      </form>
    </Fragment>
  );
};

PasswordEmailForm.propTypes = {
  setAlert: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert })(PasswordEmailForm);
