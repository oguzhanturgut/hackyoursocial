import React, { Fragment, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Spinner from '../layout/Spinner';

import { confirmEmail, resendEmail } from '../../actions/auth';

const Confirm = ({ confirmEmail, resendEmail, isAuthenticated, loading, match }) => {
  const { emailToken } = match.params;
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const onChange = e => setEmail(e.target.value);

  const onSubmit = async e => {
    e.preventDefault();
    resendEmail(email);
  };

  useEffect(() => {
    (async () => {
      setError(await confirmEmail(emailToken));
    })();
  }, [confirmEmail, emailToken]);

  if (error === 'Invalid Token') return <Redirect to='/login' />;

  if (isAuthenticated) return <Redirect to='/dashboard' />;

  if (error === 'Email validation link expired')
    return (
      <Fragment>
        <p className='lead'>
          <i className='fas fa-envelope' /> Resend Confirmation Email
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
          <input type='submit' className='btn btn-primary' value='Send' />
        </form>
      </Fragment>
    );
  return loading && <Spinner />;
};

Confirm.propTypes = {
  confirmEmail: PropTypes.func.isRequired,
  resendEmail: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
});

export default connect(mapStateToProps, { confirmEmail, resendEmail })(Confirm);
