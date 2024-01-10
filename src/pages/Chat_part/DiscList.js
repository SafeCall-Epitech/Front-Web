import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Chat_part/style/DiscList.css';
import {
    MDBInput,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBIcon,
    MDBTypography,
    MDBModal,
    MDBModalBody,
    MDBModalHeader,
    MDBModalFooter,
    MDBInputGroup,
    MDBScrollbar,
    MDBBtn
} from "mdb-react-ui-kit";
function DiscList({ onFriendSelect }) {
    const [friendList, setFriendList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [currentMessage, setCurrentMessage] = useState("");
    const [selectedFriend, setSelectedFriend] = useState(null);
    let utcstr = sessionStorage.getItem("UTC");
    let utc = parseFloat(utcstr)
    const d = new Date();
    let hour = d.getHours()
    let min = d.getMinutes();

    useEffect(() => {
        const fetchFriendList = async () => {
            sessionStorage.setItem("user_name", JSON.parse(localStorage.getItem('user')).toLowerCase())
            const response = await axios.get('https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/conversations/' + sessionStorage.getItem("user_name"));
            setFriendList(response.data["Success "])
            // setLastMessages(Array(response.data.length).fill("Dernier message"));
        };
        fetchFriendList();
    }, []);



    // const fetchFriendList = async () => {
    //     const response = await axios.get('http://localhost:3002/get_a_conv/' + sessionStorage.getItem("user_name"));
    //     setFriendList(response.data)
    //     // setLastMessages(Array(response.data.length).fill("Dernier message"));
    // };
    // const fetchMessages = async () => {
    //     const response = await axios.post('http://localhost:3002/lastmess/', {
    //         friend: friendList
    //     });
    //     console.log("ok")
    //     setLastMessages(response.data);
    //     // setLastMessages(Array(response.data.length).fill("Dernier message"));
    // };


    const handleFriendClick = (friendName) => {
        console.log('Selected Friend:', friendName);
        sessionStorage.setItem("friend_name", friendName);
        const userNames = [sessionStorage.getItem("user_name"), friendName].sort();
        sessionStorage.setItem("room", userNames[0].toLowerCase() + userNames[1].toLowerCase());
        onFriendSelect(friendName);
        setSelectedFriend(friendName);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (event) => {
        setTextInput(event.target.value);
    };

    const handleModalSubmit = async () => {
        const response = await axios.get('https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/messages/' + sessionStorage.getItem("user_name") + "/" + currentMessage);
        window.location.reload();
        closeModal();
    };

    const handleDeleteConversation = async (friend) => {
        const fr = friend.split(":");
        axios.get('https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/delRoom/' + fr[0]);
        window.location.reload();
    };

    return (
        <MDBCard className="conv_zone">
            <MDBCardBody>
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="font-weight-bold mb-3 text-center text-lg-start">
                        Conversation
                    </h5>
                    <MDBBtn size="sm" onClick={openModal}>
                        Open Modal
                    </MDBBtn>
                </div>
                <MDBTypography listUnStyled>
                    {friendList.map((friend, index) => (
                        <li className="p-2 border-bottom friend" key={friend}>
                            {/* // <li
                        //     className={`p-2 border-bottom friend ${selectedFriend === friend ? 'selected-friend' : ''}`}
                        //     key={friend}
                        // > */}
                            <a
                                href="#!"
                                className="d-flex justify-content-between"
                                onClick={() =>
                                    handleFriendClick(
                                        friend.replace(sessionStorage.getItem('user_name'), '').split(':')[0]
                                    )
                                }
                            >
                                <div className="d-flex flex-row">
                                    <img
                                        src="https://via.placeholder.com/60"
                                        alt="Profile"
                                        className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                                        width="60"
                                    />
                                    <div className="pt-1">
                                        <p className="fw-bold mb-0">
                                            {friend.replace(sessionStorage.getItem('user_name'), '').split(':')[0]}
                                        </p>
                                        <p className="small text-muted">
                                            {friend.split(':')[1] !== "" && (
                                                <>
                                                    {friend.split(':')[1]} : {friend.split(':')[2].split(" ")[1]} : {parseInt(friend.split(':')[2].split(" ")[2]) + -utc}:{friend.split(':')[3]}
                                                </>
                                            )}
                                            {/* {friend.split(':')[1]} : {friend.split(':')[2]}:{friend.split(':')[3]} */}
                                        </p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-stretch">
                                    <MDBBtn color="danger" className="w-100" size="sm" onClick={() => handleDeleteConversation(friend)}>
                                        Supprimer
                                    </MDBBtn>
                                </div>
                            </a>
                        </li>
                    ))}
                </MDBTypography>
                <div style={{ width: '30px' }}>
                    <MDBModal
                        show={isModalOpen}
                        onHide={closeModal}
                        className="custom-modal"
                        contentClassName="overlay-modal-content"
                        size="sm"
                    >
                        <MDBModalHeader className="rounded-top">Search your friend</MDBModalHeader>
                        <MDBModalBody className="rounded-bottom">
                            <input
                                type="text"
                                className="form-control-plaintext form-control-lg"
                                value={currentMessage}
                                placeholder="Entrer votre message"
                                onChange={(event) => {
                                    setCurrentMessage(event.target.value);
                                }}
                            />
                        </MDBModalBody>
                        <MDBModalFooter className="rounded-bottom">
                            <MDBBtn color="secondary" onClick={closeModal}>
                                Close
                            </MDBBtn>
                            <MDBBtn color="primary" onClick={handleModalSubmit}>
                                Submit
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </div>
            </MDBCardBody>
        </MDBCard>
    );





    // return (
    //     <MDBCard className="conv_zone">
    //         <MDBCardBody>
    //             <div className="d-flex justify-content-between align-items-center">
    //                 <h5 className="font-weight-bold mb-3 text-center text-lg-start">
    //                     Conversation
    //                 </h5>
    //                 <MDBBtn size="sm" onClick={openModal}>
    //                     Open Modal
    //                 </MDBBtn>
    //             </div>
    //             <MDBTypography listUnStyled>
    //                 {friendList.map((friend, index) => (
    //                     <li className="p-2 border-bottom friend" key={friend}>
    //                         <a
    //                             href="#!"
    //                             className="d-flex justify-content-between"
    //                             onClick={() =>
    //                                 handleFriendClick(
    //                                     friend.replace(sessionStorage.getItem('user_name'), '').split(':')[0]
    //                                 )
    //                             }
    //                         >
    //                             <div className="d-flex flex-row">
    //                                 <img
    //                                     src="https://via.placeholder.com/60"
    //                                     alt="Profile"
    //                                     className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
    //                                     width="60"
    //                                 />
    //                                 <div className="pt-1">
    //                                     <p className="fw-bold mb-0">
    //                                         {friend.replace(sessionStorage.getItem('user_name'), '').split(':')[0]}
    //                                     </p>
    //                                     <p className="small text-muted">
    //                                         {friend.split(':')[1]} : {friend.split(':')[2]}:{friend.split(':')[3]}
    //                                     </p>
    //                                 </div>
    //                             </div>
    //                             <div className="pt-1"></div>
    //                         </a>
    //                     </li>
    //                 ))}
    //             </MDBTypography>
    //             <div style={{ width: '30px' }}>
    //                 <MDBModal
    //                     show={isModalOpen}
    //                     onHide={closeModal}
    //                     className="custom-modal"
    //                     contentClassName="overlay-modal-content"
    //                     size="sm" // Set the modal size to small
    //                 >
    //                     <MDBModalHeader className="rounded-top">Search your friend</MDBModalHeader>
    //                     <MDBModalBody className="rounded-bottom">

    //                         <input
    //                             type="text"
    //                             className="form-control-plaintext form-control-lg"
    //                             value={currentMessage}
    //                             placeholder="Entrer votre message"
    //                             onChange={(event) => {
    //                                 setCurrentMessage(event.target.value);
    //                             }}

    //                         />
    //                     </MDBModalBody>
    //                     <MDBModalFooter className="rounded-bottom">
    //                         <MDBBtn color="secondary" onClick={closeModal}>
    //                             Close
    //                         </MDBBtn>
    //                         <MDBBtn color="primary" onClick={handleModalSubmit}>
    //                             Submit
    //                         </MDBBtn>
    //                     </MDBModalFooter>
    //                 </MDBModal>
    //             </div>
    //         </MDBCardBody>
    //     </MDBCard>
    // );

}

export default DiscList;
