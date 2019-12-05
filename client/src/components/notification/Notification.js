import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import { getNotifications } from '../../actions/notification';
import NotificationItem from './NotificationItem';

const Notification = ({ getNotifications, notification: { notifications, loading } }) => {
  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>
        <i className='fas fa-bell'></i>
        {` `}Notifications
      </h1>
      <p className='lead'>All Your Notifications</p>
      <div className='notification'>
        <table className='table'>
          <thead>
            <tr>
              <th className='hide-sm'>All Notifications</th>
              <th>{notifications.length}</th>
            </tr>
            <tr>
              <th className='hide-sm'>Unread</th>
              <th>{notifications.length}</th>
            </tr>
            <tr>
              <th className='hide-sm'>Read</th>
              <th>{notifications.length}</th>
            </tr>
          </thead>
        </table>
        <table className='table'>
          <thead>
            <tr>
              <th className='hide-sm'>Notifications</th>
              <th>{notifications.length}</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map(item => (
              <NotificationItem key={item._id} text={item.text} date={item.date} />
            ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

Notification.propTypes = {
  getNotifications: PropTypes.func.isRequired,
  notification: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({ notification: state.notification });

export default connect(mapStateToProps, { getNotifications })(Notification);
