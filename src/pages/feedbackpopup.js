// PopupModal.js
import React from 'react';
import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBInput,
  } from "mdb-react-ui-kit";  

const PopupModal = ({ isOpen, toggleModal, onInputChange, onSubmit }) => {
  return (
    <MDBModal show={isOpen} onHide={() => toggleModal(false)} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Modal title</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => toggleModal(false)} // Corrected
                ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
            <MDBInput
                type="textarea"
                label="Enter your feedback"
                rows={5}
                onChange={onInputChange}
                />
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={() => toggleModal(false)}>
                Close
              </MDBBtn>
                <MDBBtn color="primary" onClick={onSubmit}>
                    Submit Feedback
                </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
  );
};

export default PopupModal;