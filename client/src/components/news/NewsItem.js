import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


const NewsItem = ({ post: { _id, text,user,post, name, avatar, comments, likes } }) => {
  return (
    <div className="news_feed">
      <Link to={`/profile/${user}`}><img src={avatar} alt="" className="user_img" /></Link>
      <div className="post_news">
       <Link to={`/profile/${user}`}><p>
          <strong>{name}</strong> <span className="post_notification">posted</span>
        </p></Link> 
        <p className="news_text">
          {text
            .split(' ')
            .splice(0, 10)
            .join(' ')}
        </p>
        <Link to={`/posts/${_id}`} >
        <p className="more_news text-bold">...more</p>
        </Link>
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
