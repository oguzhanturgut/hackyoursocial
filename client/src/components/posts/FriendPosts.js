import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import PostItem from "./PostItem";
import { getPosts } from "../../actions/post";

const FriendPosts = ({
  getPosts,
  post: { posts, loading },
  match,
  auth: { user }
}) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const friendPosts = posts.filter(post => post.user === match.params.userId);

  return loading ? (
    <Spinner />
  ) : friendPosts.length === 0 ? (
    <h2>Your friend has no posts yet.</h2>
  ) : (
    <Fragment>
      <h1 className='large text-primary'>{friendPosts[0].name}'s Posts</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Welcome {user.name}
      </p>

      <div className='posts'>
        {friendPosts.map(post => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </Fragment>
  );
};

FriendPosts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post,
  auth: state.auth
});

export default connect(mapStateToProps, { getPosts })(FriendPosts);
