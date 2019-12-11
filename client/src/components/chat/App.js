import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from './../layout/Spinner';

import Chat from './Chat';

const App = ({ auth: { user }, chat }) => {
  if (!user) {
    return <Spinner />;
  }

  const username = user.name;
  const chatApp = username ? <Chat user={user} /> : null;
  return <Fragment>{chatApp}</Fragment>;
};

App.propTypes = {
  auth: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.user,
  auth: state.auth,
  chat: state.chat,
});

export default connect(mapStateToProps)(App);
