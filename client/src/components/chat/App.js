import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from './../layout/Spinner';

import Chat from './Chat';

const App = ({ auth: { user }, chat }) => {
  if (!user) {
    return <Spinner />;
  }

  if (!chat.userlist.length) {
  }

  const username = user.name;
  const chatt = username ? <Chat user={user} /> : null;
  return <Fragment>{chatt}</Fragment>;
};

App.propTypes = {
  auth: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.user,
  auth: state.auth,
  chat: state.chat

});

export default connect(mapStateToProps)(App);
