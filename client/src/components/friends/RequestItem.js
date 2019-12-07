import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { acceptFriendRequest, cancelFriendRequest } from "../../actions/auth";
import Spinner from "../layout/Spinner";

const RequestItem = ({
  auth: { user, loading },
  acceptFriendRequest,
  cancelFriendRequest
}) => {
  return loading && user === null ? (
    <Spinner />
  ) : (
    user.request.map(req => (
      <div className='friend-card bg-light my-1' key={req._id}>
        <img src={req.avatar} alt='' className='round-img' />
        <div className='friend-name-card m-1 p-1'>
          <p className='my-1'>
            <i className='fas fa-user-plus' /> {"  "}
            {req.username}
          </p>
          <Link to={`/profile/${req.userId}`} className='btn btn-primary'>
            View Profile
          </Link>
        </div>
        <div className='m'>
          <button
            className='btn btn-success m'
            onClick={() => acceptFriendRequest(req.userId)}
          >
            <i className='fa fa-thumbs-up'></i>
            {"  "}Confirm
          </button>
          <button
            className='btn btn-danger m'
            onClick={() => cancelFriendRequest(req.userId)}
          >
            <i className='fa fa-thumbs-down'></i> Reject
          </button>
        </div>
      </div>
    ))
  );
};

RequestItem.propTypes = {
  acceptFriendRequest: PropTypes.func.isRequired,
  cancelFriendRequest: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  acceptFriendRequest,
  cancelFriendRequest
})(RequestItem);
