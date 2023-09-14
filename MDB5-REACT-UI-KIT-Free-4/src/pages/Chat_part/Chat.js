import React, { useState, useEffect } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";
import '../Chat_part/style/Chat.css';
import Print_message from '../Chat_part/Print_message';
import axios from 'axios';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBIcon,
    MDBInputGroup,
    MDBScrollbar,
    MDBBtn
} from "mdb-react-ui-kit";

function Chat({ selectedFriend }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('http://20.234.168.103:8080/messages/' + sessionStorage.getItem("user_name") + "/" + selectedFriend);
                if (response.data["Success "] == null) {
                    setMessageList([]);
                } else {
                    setMessageList(response.data["Success "]);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }



        };

        fetchMessages();
    }, [selectedFriend]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const msg = { "Sender": sessionStorage.getItem("user_name"), "Message": currentMessage };
            console.log(selectedFriend)
            await axios.post('http://20.234.168.103:8080/sendMessage', {
                message: currentMessage,
                username: sessionStorage.getItem("user_name"),
                friendname: selectedFriend
            });

            setMessageList([...messageList, msg]);
            setCurrentMessage("");
        }
    };

    return (
        <MDBContainer>
            <MDBRow>
                <MDBCol>
                    <MDBCard style={{ borderRadius: "15px" }}>
                        <MDBCardBody className='Col'>
                            <MDBCol>
                                <MDBRow>
                                    <ScrollToBottom className="Chat">
                                        <Print_message _messageList={messageList} />
                                    </ScrollToBottom>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol>
                                        <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                                            <input
                                                type="text"
                                                className="form-control-plaintext form-control-lg"
                                                value={currentMessage}
                                                placeholder="Entrer votre message"
                                                onChange={(event) => {
                                                    setCurrentMessage(event.target.value);
                                                }}
                                                onKeyPress={(event) => {
                                                    event.key === "Enter" && sendMessage();
                                                }}
                                            />
                                            <MDBBtn onClick={sendMessage}><MDBIcon fas icon="paper-plane" /></MDBBtn>
                                        </div>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCol>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default Chat;
