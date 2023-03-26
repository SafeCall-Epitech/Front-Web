import React, { useState } from 'react';
import axios from 'axios';
import { MDBInputGroup, MDBInput, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';

export default function App() {
  const [Name, setProfile] = useState('');

  const handleSearch = async () => {
    const res = await axios.get(`http://20.234.168.103:8080/profile/${Name}`);
    console.log(res.data);
    setProfile(res.data['profile']['FullName']);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '20vh' }}>
      <MDBInputGroup>
        <MDBInput label='Search' onChange={(e) => setProfile(e.target.value)} />
        <MDBBtn rippleColor='dark' onClick={handleSearch}>
          <MDBIcon icon='search' />
        </MDBBtn>
      </MDBInputGroup>
    </div>
  );
}