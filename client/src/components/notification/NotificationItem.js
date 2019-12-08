import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import Spinner from '../layout/Spinner';
import { deleteNotification, updateNotification } from '../../actions/notification';

const NotificationItem = ({
  deleteNotification,
  updateNotification,
  id,
  auth,
  text,
  date,
  link,
  className,
  notification: { loading },
}) =>
  loading ? (
    <Spinner />
  ) : (
    <tr className={className}>
      <Link to={link} onClick={() => updateNotification(id)}>
        <td>{text}</td>
        <td>
          <Moment fromNow ago>
            {date}
          </Moment>
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
  updateNotification: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  notification: state.notification,
});

export default connect(mapStateToProps, { deleteNotification, updateNotification })(
  NotificationItem,
);
