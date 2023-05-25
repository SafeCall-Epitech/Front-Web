import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MDBCard, MDBCardBody, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import '../style/DiscList.css';

function DiscList({ onFriendSelect }) {
    const [friendList, setFriendList] = useState([]);
    const [lastMessages, setLastMessages] = useState([]);

    useEffect(() => {
        const fetchFriendList = async () => {
            const response = await axios.get('http://localhost:3002/get_a_conv/' + sessionStorage.getItem("user_name"));
            setFriendList(response.data)
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
        sessionStorage.setItem("friend_name", friendName);
        const userNames = [sessionStorage.getItem("user_name"), friendName].sort();
        sessionStorage.setItem("room", userNames[0].toLowerCase() + userNames[1].toLowerCase());
        onFriendSelect(friendName);
    };

    return (
        <MDBCard className="conv_zone">
            <MDBCardBody>
                <h5 className="font-weight-bold mb-3 text-center text-lg-start">Conversation</h5>
                <MDBTypography listUnStyled>
                    {friendList.map((friend, index) => (
                        <li className="p-2 border-bottom friend" key={friend} >
                            <a href="#!" className="d-flex justify-content-between" onClick={() => handleFriendClick(friend.replace(sessionStorage.getItem("user_name"), ""))}>
                                <div className="d-flex flex-row">
                                    <img
                                        src="https://via.placeholder.com/60"
                                        alt="Profile"
                                        className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                                        width="60"
                                    />
                                    <div className="pt-1">
                                        <p className="fw-bold mb-0">{friend.replace(sessionStorage.getItem("user_name"), "")}</p>
                                        <p className="small text-muted">{lastMessages[index]}</p>
                                    </div>
                                </div>
                                <div className="pt-1">
                                    {/* <p className="small text-muted mb-1">Just now</p> */}
                                </div>
                            </a>
                        </li>
                    ))}
                </MDBTypography>
            </MDBCardBody>
        </MDBCard>
    );
}

export default DiscList;
