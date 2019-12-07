import React from 'react';
import { Link } from 'react-router-dom';

const UserList = ({ chatData: { messages, userlist, username } }) => {
  const countUserMessage = messages.filter(msg => {
    return msg.username === username[0];
  });

  const users = userlist.users.map((chatUser, key) => (
    <li className="active grey lighten-3 p-2" key={key}>
      <Link to={`/profile/${chatUser.userID}`} className="d-flex justify-content-between my-2">
        <img
          src={chatUser.userAvatar}
          alt={chatUser.username + ' avatar'}
          className="avatar rounded-circle d-flex align-self-center mr-2 z-depth-1"
        />
        <div className="text-small">
          <strong className="chat-user">{chatUser.username}</strong>
          <p className="last-message text-muted">{}</p>
        </div>
        <div className="chat-footer">
          <p className="text-smaller text-muted mb-0">Online</p>
          {username[1] === chatUser.userID && (
            <span className="badge badge-success float-right">{countUserMessage.length}</span>
          )}
        </div>
      </Link>
    </li>
  ));
  return (
    <div className="white z-depth-1 px-3 pt-3 pb-0">
      <ul className="list-unstyled friend-list">{users}</ul>
    </div>
  );
};

export default UserList;
