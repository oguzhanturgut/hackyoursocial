import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { sendFriendRequest } from '../../actions/auth';
import { socket } from '../../utils/socketClient';

const ProfileItem = ({
  sendFriendRequest,
  auth,
  profile: {
    user: { _id, name, avatar },
    status,
    company,
    location,
    skills,
  },
}) => {
  const handleClick = e => {
    // e.preventDefault();
    // sendFriendRequest(_id);
    // send message
    socket.emit('friendRequest', {
      senderId: auth.user._id,
      senderName: auth.user.name,
      receiverId: _id,
      receiverName: name,
    });
  };

  return (
    <div className="profile bg-light">
      <img src={avatar} alt="" className="round-img" />
      <div>
        <h2>{name}</h2>
        <p>
          {status} {company && <span> at {company}</span>}
        </p>
        <p className="my-1">{location && <span>{location}</span>}</p>
        <Link to={`/profile/${_id}`} className="btn btn-primary">
          View Profile
        </Link>
        <button className="btn btn-success" onClick={handleClick}>
          Send Friend Request
        </button>
      </div>
      <ul>
        {skills.slice(0, 4).map((skill, index) => (
          <li key={index} className="text-primary">
            <i className="fas fa-check" /> {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

ProfileItem.propTypes = {
  sendFriendRequest: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  sendFriendRequest,
})(ProfileItem);
