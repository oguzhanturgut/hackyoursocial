import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profile';
import Pagination from './Pagination';

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  const [searchField, setSearchField] = useState('');
  const filteredProfiles = profiles.filter(profile => {
    const userName = profile.user.name.toLowerCase().substring(0, 3);
    const searchText = searchField.toLowerCase().substring(0, 3);
    return userName.includes(searchText);
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [profilesPerPage] = useState(5);

  // Get current posts
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = filteredProfiles.slice(indexOfFirstProfile, indexOfLastProfile);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop" /> Browse and connect with developers
          </p>
          <div className="div_search">
            <input
              className="search-txt"
              type="search"
              placeholder="search for developers"
              onChange={e => {
                setSearchField(e.target.value);
                setCurrentPage(1);
              }}
            />
            <i className="search-btn fas fa-search"></i>
          </div>
          <Pagination
            profilesPerPage={profilesPerPage}
            totalProfiles={filteredProfiles.length}
            paginate={paginate}
            currentPage={currentPage}
          />
          <div className="profiles">
            {filteredProfiles.length > 0 ? (
              currentProfiles.map(profile => <ProfileItem key={profile._id} profile={profile} />)
            ) : (
              <h4>No profiles found...</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
