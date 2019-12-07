import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import Spinner from '../layout/Spinner';
import { deleteNotification } from '../../actions/notification';

const NotificationItem = ({
  deleteNotification,
  id,
  auth,
  text,
  date,
  link,
  className,
  status,
  notification: { loading, notifications },
}) =>
  loading ? (
    <Spinner />
  ) : (
    <tr className={className}>
      <Link to={link}>
        <td>{text}</td>
        <td>
          <Moment format='DD.MM.YYYY HH:mm:ss'>{date}</Moment>
        </td>
      </Link>
      <td onClick={() => deleteNotification(id)}>
        <i className='fas fa-trash'></i>
      </td>
    </tr>
  );

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteNotification: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  notification: state.notification,
});

export default connect(mapStateToProps, { deleteNotification })(NotificationItem);
