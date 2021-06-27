import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import axios from 'axios';
import { createBrowserHistory } from 'history';
import 'react-quill/dist/quill.snow.css';

const LandingPage = ({ match }) => {
  const history = useRef(createBrowserHistory({ forceRefresh: true }));
  const [contents, setContents] = useState('');

  const handleChange = (e) => {
    setContents(e);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.post(
        '/get-document',
        { id: match.params.documentId },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data === 'not authenticated') {
        history.current.push('/login');
      } else if (res.data.status === 'success') {
        setContents(res.data.content);
      } else if (res.data === 'No Document Found') {
        history.current.push('/');
      } else {
        alert(res.data);
      }
    };
    fetchData();
  }, [match.params.documentId]);

  const handleCkick = async () => {
    const res = await axios.post(
      '/set-content',
      { id: match.params.documentId, content: contents },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (res.data === 'not authenticated') {
      history.current.push('/login');
    } else if (res.data === 'No Document Found') {
      history.current.push('/');
    }
  };

  return (
    <>
      <div className="react-quill">
        <ReactQuill theme="snow" value={contents} onChange={handleChange} />
        <button onClick={handleCkick}>Save</button>
      </div>
    </>
  );
};
export default LandingPage;
