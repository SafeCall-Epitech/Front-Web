// EditButton.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import { useParams } from 'react-router-dom';

export default function EditButton() {
  const { name } = useParams();
  const [Name, setName] = useState('');
  const [Load, setLoad] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://20.234.168.103:8080/profile/${name}`);
        setName(res.data['profile']['FullName']);
        setLoad(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [name]);

  return (
    <section style={{ top: '0', bottom: '0', right: '0', left: '0', backgroundColor: '#E6E6E6' }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="9" xl="8">
            <MDBCard>
              {/* ... (rest of your component code) */}
              <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                {/* ... (rest of your component code) */}
              </div>
              <div className="p-4 text-black" style={{ backgroundColor: '#E6E6E6' }}>
                {/* ... (rest of your component code) */}
                {Load ? (
                  <MDBCardText className="text-muted">None</MDBCardText>
                ) : (
                  <MDBCardText className="text-muted">{Description}</MDBCardText>
                )}
                {/* ... (rest of your component code) */}
              </div>
              {/* ... (rest of your component code) */}
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
