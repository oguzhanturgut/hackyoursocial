// import React from 'react';
// import firebase from 'firebase/app';
// import 'firebase/auth';
// import socialConfig from '../../social-config/firebaseConfig';
// import { handleLoginGoogle } from '../../actions/auth';
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import { Redirect } from 'react-router-dom';

// if (!firebase.apps.length) {
//   firebase.initializeApp(socialConfig);
// }

// const GoogleAuth = ({ handleLoginGoogle, isAuthenticated, accessToken }) => {
//   if (isAuthenticated) {
//     return <Redirect to='/dashboard' />;
//   }
//   return (
//     <div>
//       <button className='btn' onClick={() => handleLoginGoogle(accessToken)}>
//         Login with Google
//       </button>
//     </div>
//   );
// };

// GoogleAuth.propTypes = {
//   handleLoginGoogle: PropTypes.func.isRequired,
//   isAuthenticated: PropTypes.bool,
// };

// const mapStateToProps = state => ({
//   isAuthenticated: state.auth.isAuthenticated,
//   accessToken: state.auth.token,
// });

// export default connect(mapStateToProps, { handleLoginGoogle })(GoogleAuth);
