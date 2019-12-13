import React from 'react';
import { Link } from 'react-router-dom';

const Pagination = ({ profilesPerPage, totalProfiles, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalProfiles / profilesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number, i) => (
          <li key={number} className={currentPage === i + 1 ? 'page-item active' : 'page-item'}>
            <Link to="#" onClick={() => paginate(number)} className="page-link">
              {number}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
