import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const NotificationItem = ({ auth, text }) => (
  <tr>
    <td className='hide-sm'>{text}</td>
    <td>
      <i className='fas fa-trash'></i>
    </td>
  </tr>
);

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(NotificationItem);
