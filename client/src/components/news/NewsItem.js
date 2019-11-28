import React from 'react';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const NewsItem = ({ post: { text, name, avatar, comments, likes } }) => {
  return (
    <div className="news_feed">
      <img src={avatar} alt="" className="user_img" />
      <div className="post_news">
        <p>
          <strong>{name}</strong> <span className="post_notification">posted</span>
        </p>
        <p className="news_text">
          {text
            .split(' ')
            .splice(0, 5)
            .join(' ')}
        </p>
        <p className="more_news">...more</p>
        <i className="far fa-thumbs-up news_social"> {likes.length}</i>
        <i className="fas fa-comment news_social"> {comments.length}</i>
      </div>
    </div>
  );
};

NewsItem.propTypes = {
  post: PropTypes.object.isRequired,
};

export default NewsItem;
