import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { removeFriend } from "../../actions/auth";
import Spinner from "../layout/Spinner";

const FriendItem = ({ auth: { user, loading }, removeFriend }) => {
  return loading && user === null ? (
    <Spinner />
  ) : (
    user.friendsList.map(friend => (
      <div className='friend-card bg-light my-1' key={friend._id}>
        <img src={friend.avatar} alt='' className='round-img' />
        <div className='friend-name-card m-1 p-1'>
          <p className='my-1'>
            <i className='fas fa-user' /> {friend.friendName}
          </p>
          <Link to={`/profile/${friend.friendId}`} className='btn btn-primary'>
            View Profile
          </Link>
        </div>
        <div className='m'>
          <button
            className='btn btn-danger m'
            onClick={() => removeFriend(friend.friendId)}
          >
            <i className='fas fa-user-slash'></i>
            {"  "}Unfriend
          </button>
          <Link
            to={`/friend-posts/${friend.friendId}`}
            className='btn btn-primary m'
          >
            View Posts
          </Link>
        </div>
      </div>
    ))
  );
};

FriendItem.propTypes = {
  removeFriend: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  removeFriend
})(FriendItem);
