import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { sendFriendRequest } from "../../actions/auth";
import moment from "moment";
import Moment from "react-moment";
const ProfileItem = ({
  sendFriendRequest,
  profile: {
    user: { _id, name, avatar },
    status,
    company,
    location,
    skills
  },
  auth: { user, isAuthenticated }
}) => {
  const Button = () => {
    if (!isAuthenticated) return <></>;
    if (isAuthenticated && user._id !== _id) {
      const isFriend = user.friendsList.filter(
        friend => friend.friendId === _id
      );
      const isRequested = user.request.filter(req => req.userId === _id);
      const isSent = user.sentRequest.filter(sendReq => sendReq.userId === _id);
      if (isFriend.length > 0) {
        return (
          <p className='text-primary my-1'>
            <i className='fas fa-clock'></i> Friends since:{" "}
            <Moment format='DD/MM/YYYY HH:mm:ss'>
              {moment.utc(isFriend.date)}
            </Moment>
          </p>
        );
      }
      if (isRequested.length > 0) {
        return (
          <p className='text-primary my-1'>
            <i className='fas fa-clock'></i> Requested at:{" "}
            <Moment format='DD/MM/YYYY HH:mm:ss'>
              {moment.utc(isRequested.date)}
            </Moment>
          </p>
        );
      }
      if (isSent.length > 0) {
        return (
          <p className='text-primary my-1'>
            {" "}
            <i className='fas fa-clock'></i> Request sent at: {"   "}
            <Moment format='DD/MM/YYYY HH:mm:ss'>
              {moment.utc(isSent.date)}
            </Moment>
          </p>
        );
      }
      if (_id === user._id) {
        return <></>;
      }
      return (
        <button
          className='btn btn-success'
          onClick={() => sendFriendRequest(_id)}
        >
          <i className='fas fa-user-plus'></i> Send Friend Request
        </button>
      );
    }
    return <></>;
  };
  return (
    <div className='profile bg-light'>
      <img src={avatar} alt='' className='round-img' />
      <div>
        <h2>{name}</h2>
        <p>
          {status} {company && <span> at {company}</span>}
        </p>
        <p className='my-1'>{location && <span>{location}</span>}</p>
        <Link to={`/profile/${_id}`} className='btn btn-primary'>
          View Profile
        </Link>
        <Button />
      </div>
      <ul>
        {skills.slice(0, 4).map((skill, index) => (
          <li key={index} className='text-primary'>
            <i className='fas fa-check' /> {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};
ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool,
  sendFriendRequest: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, { sendFriendRequest })(ProfileItem);
