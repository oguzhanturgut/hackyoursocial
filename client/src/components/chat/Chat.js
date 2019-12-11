import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { receiveUsers, receiveMessage, receiveUsername } from '../../actions/chat';

import UserList from './UserList';
import Messages from './Messages';
import Spinner from '../layout/Spinner';
import { socket } from './../../utils/socketClient';
const Chat = ({ user, chat, receiveMessage, receiveUsers, receiveUsername }) => {
  const username = user.name;
  useEffect(() => {
    receiveUsername([username, user._id]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const [formData, setFormData] = useState({
    text: '',
  });
  const { text } = formData;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const chatSocket = () => {
    // receive userlist
    socket.on('chat users', ({ room, users }) => {
      receiveUsers({ room, users });
    });

    // send join message
    socket.emit(
      'chat join',
      {
        timestamp: new Date(),
        username,
        userID: user._id,
        userAvatar: user.avatar,
        room: 'general',
      },
      error => {
        if (error) {
          return;
        }
      },
    );

    // receive join message
    socket.on('chat join', msg => {
      receiveMessage(msg);
    });

    // receive leave message
    socket.on('chat leave', msg => {
      receiveMessage(msg);
    });

    // receive message
    socket.on('chat message', msg => {
      receiveMessage(msg);
    });

    // send leave message when user leaves the page
    window.addEventListener('beforeunload', e => {
      e.preventDefault();

      socket.emit('chat leave', {
        timestamp: new Date(),
        username,
        userID: user._id,
        room: 'general',
      });
    });
  };
  useEffect(() => {
    chatSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update state from input
  const onChange = e => {
    setFormData({ [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    // send message
    socket.emit('chat message', {
      timestamp: new Date(),
      username,
      message: text,
      userAvatar: user.avatar,
    });

    setFormData({ text: '' });
  };

  return (
    <div className="card grey lighten-3 chat-room">
      <div className="card-body">
        <div className="row px-lg-2 px-2">
          <div className="col-sm-9 col-md-9 col-xl-8 pl-md-3 px-lg-auto px-0 chat-message-container">
            <div className="chat-message">
              <Messages messages={chat.messages} username={username} />
            </div>

            <form onSubmit={onSubmit}>
              <input
                className="chat-input"
                name="text"
                type="text"
                cols="30"
                rows="5"
                maxLength="400"
                placeholder="Write something"
                value={text}
                onChange={onChange}
                autoComplete="false"
                autoFocus
                required
              />
              <button className="chat-send-button" type="submit" value="submit">
                Send
              </button>
            </form>
          </div>
          <div className="col-sm-3 col-md-3 col-xl-4 px-0 chat-user-container">
            <h6 className="font-weight-bold mb-3 text-center text-lg-left">Members</h6>
            {chat.userlist.users ? <UserList chatData={chat} /> : <Spinner />}
          </div>
        </div>
      </div>
    </div>
  );
};

Chat.propTypes = {
  receiveUsers: PropTypes.func.isRequired,
  receiveMessage: PropTypes.func.isRequired,
  receiveUsername: PropTypes.func.isRequired,
  auth: PropTypes.object,
  chat: PropTypes.object,
};

const mapStateToProps = state => ({
  chat: state.chat,
  auth: state.auth,
});

export default connect(mapStateToProps, { receiveUsers, receiveMessage, receiveUsername })(Chat);
