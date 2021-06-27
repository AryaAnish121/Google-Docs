import React, { useEffect, useRef, useState } from 'react';
import CreateDocument from './CreateDocument';
import Document from './Document';
import { createBrowserHistory } from 'history';
import axios from 'axios';

const MainPage = () => {
  const history = useRef(createBrowserHistory({ forceRefresh: true }));
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.post(
        '/get-all-documents',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (res.data === 'not authenticated') {
        history.current.push('/login');
      } else {
        setDocuments(res.data);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-documents">
      <CreateDocument />
      {documents.map((eachDocument, index) => {
        return <Document {...eachDocument} key={index} />;
      })}
    </div>
  );
};
export default MainPage;
