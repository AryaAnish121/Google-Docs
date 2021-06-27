import React from 'react';
import { Link } from 'react-router-dom';

const Document = ({ id, title }) => {
  return (
    <Link to={`/edit/${id}`}>
      <h1>{title}</h1>
    </Link>
  );
};
export default Document;
