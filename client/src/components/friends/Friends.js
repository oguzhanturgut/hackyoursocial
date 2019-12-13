import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { loadUser } from '../../actions/auth';
import FriendItem from './FriendItem';
import RequestItem from './RequestItem';
import WaitingItem from './WaitingItem';

const Friends = ({ auth: { user, loading } }) => {
  return loading && user === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h2 className="text-primary my-2">My Friends</h2>
      {user.friendsList.length > 0 ? (
        <FriendItem />
      ) : (
        <p className="text-primary bg-light p-1">
          <i className="fab fa-connectdevelop" /> You have no friends yet.
        </p>
      )}
      <h2 className="text-primary my-2">My Requests</h2>

      {user.request.length > 0 ? (
        <RequestItem />
      ) : (
        <p className="text-primary bg-light p-1">
          <i className="fab fa-connectdevelop" /> You have no friendship requests.
        </p>
      )}
      <h2 className="text-primary my-2">My Waiting List</h2>
      {user.sentRequest.length > 0 ? (
        <WaitingItem />
      ) : (
        <p className="text-primary bg-light p-1">
          <i className="fab fa-connectdevelop" />
          You have no pending requests.
        </p>
      )}
    </Fragment>
  );
};

Friends.propTypes = {
  loadUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { loadUser })(Friends);
