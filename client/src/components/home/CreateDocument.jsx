import React from 'react';
import axios from 'axios';
import { createBrowserHistory } from 'history';

const CreateDocument = () => {
  const history = createBrowserHistory({ forceRefresh: true });
  const handleClick = async () => {
    const title = prompt("What's the title");

    const res = await axios.post(
      '/create-document',
      { title: title },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (res.data.status === 'success') {
      history.push(`/edit/${res.data.id}`);
    } else if (res.data === 'not authenticated') {
      history.push('/login');
    } else {
      alert(res.data);
    }
  };

  return (
    <div className="create-document" onClick={handleClick}>
      <img
        src="https://ssl.gstatic.com/docs/templates/thumbnails/docs-blank-googlecolors.png"
        alt="create document"
      />
    </div>
  );
};
export default CreateDocument;
