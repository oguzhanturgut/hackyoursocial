import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import NewsItem from './NewsItem';
import { getLatestPosts } from '../../actions/post';

const News = ({ getLatestPosts, post: { latestPosts, loading } }) => {
  useEffect(() => {
    getLatestPosts();
  }, [getLatestPosts]);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">
            News <i className="fas fa-rss"></i>
          </h1>
          <div className="news-div">
            {latestPosts.length > 0 ? (
              latestPosts.map(post => <NewsItem key={post._id} post={post} />)
            ) : (
              <h4>No News found...</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

News.propTypes = {
  getLatestPosts: PropTypes.func.isRequired,
  latestPosts: PropTypes.object,
};

const mapStateToProps = state => ({
  post: state.post,
});

export default connect(mapStateToProps, { getLatestPosts })(News);
