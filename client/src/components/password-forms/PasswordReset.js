import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';

const PasswordReset = ({ match, setAlert }) => {
  const [formData, setFormData] = useState({
    password: '',
    password2: '',
  });

  const { password, password2 } = formData;
  const [redirect, setRedirect] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [resetError, setResetError] = useState(false);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const resetPasswordLink = match.params.token;
  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
      e.target.password.value = '';
      e.target.password2.value = '';
    } else {
      try {
        const reqConfig = {
          headers: {
            'Content-Type': 'application/json',
          },
        };

        const reqBody = JSON.stringify({
          resetPasswordLink,
          newPassword: formData.password,
        });
        setShowSpinner(true);
        await axios.put(`/api/auth/reset-password`, reqBody, reqConfig);
        setShowSpinner(false);
        setRedirect(true);
      } catch (err) {
        console.error(err.message);
        setAlert('Password reset link is invalid!', 'danger');
        setResetError(true);
      }
    }
  };

  if (resetError) {
    return (
      <Fragment>
        <p className='lead'>Something went wrong with your reset password link.</p>
        <p className='my-1'>
          Resend Recovery Email? <Link to='/email-password'>Resend password recovery email</Link>
        </p>
      </Fragment>
    );
  }

  if (redirect) {
    setAlert(`Password changed successfully!`, 'success');
    return <Redirect to='/login' />;
  }

  return showSpinner ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Reset Password</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Input your new Password
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Repeat your password'
            name='password2'
            onChange={e => onChange(e)}
            required
          />
        </div>

        <input type='submit' className='btn btn-primary' value='Submit' />
      </form>
    </Fragment>
  );
};

PasswordReset.propTypes = {
  setAlert: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

export default connect(null, { setAlert })(PasswordReset);
