import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import Moment from "react-moment";
import Spinner from "../layout/Spinner";

const WaitingItem = ({ auth: { user, loading } }) => {
  return loading && user === null ? (
    <Spinner />
  ) : (
    user.sentRequest.map(req => (
      <div className='friend-card bg-light my-1' key={req._id}>
        <img src={req.avatar} alt='' className='round-img' />
        <div className='friend-name-card m-1 p-1'>
          <p className='my-1'>
            {" "}
            <i className='fas fa-user-clock'></i> {req.username}
          </p>
          <Link to={`/profile/${req.userId}`} className='btn btn-primary'>
            View Profile
          </Link>
        </div>
        <ul className='text-primary'>
          <li>
            <button className='btn btn-dark'>
              <i className='fas fa-hourglass-half'></i>
              {"   "} Pending Request
            </button>
          </li>
          <li className='my-1'>
            <i className='fas fa-clock'></i> Request sent at: {"   "}
            <Moment format='DD/MM/YYYY HH:mm:ss'>{moment.utc(req.date)}</Moment>
          </li>
        </ul>
      </div>
    ))
  );
};

WaitingItem.propTypes = {
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {})(WaitingItem);
