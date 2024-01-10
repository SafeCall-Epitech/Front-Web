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
    const [numberMessage, setNumberMessage] = useState(0)
    const [messageList, setMessageList] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    useEffect(() => {
        if (selectedFriend != "" && selectedFriend != null) {

            const fetchMessages = async () => {
                try {
                    const response = await axios.get('https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/messages/' + sessionStorage.getItem("user_name") + "/" + selectedFriend);
                    if (response.data["Success "] == null) {
                        setMessageList([]);
                        setNumberMessage(0)
                    } else {
                        setMessageList(response.data["Success "]);
                        setNumberMessage(response.data["Success "].length)
                    }
                } catch (error) {
                    console.error("Error fetching messages:", error);
                }
            };


            fetchMessages();
        }

    }, [selectedFriend]);


    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/messages/' + sessionStorage.getItem("user_name") + "/" + selectedFriend);
                if (response.data["Success "].length > numberMessage) {
                    setMessageList(response.data["Success "]);
                    setNumberMessage(response.data["Success "].length)
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        const intervalId = setInterval(() => {
            fetchMessages();
        }, 1000);

        return () => clearInterval(intervalId);

    },);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const msg = { "Sender": sessionStorage.getItem("user_name"), "Message": currentMessage };


            await axios.post('https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/sendMessage', {
                message: currentMessage,
                username: sessionStorage.getItem("user_name"),
                friendname: selectedFriend
            });

            // await axios.post('http://localhost:3000/send_message', {
            //     message: currentMessage,
            //     username: sessionStorage.getItem("user_name"),
            //     friendname: selectedFriend
            // });
            // socket.emit('chat message', { "Sender": sessionStorage.getItem("user_name"), "Message": currentMessage });
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
                                                placeholder={`${selectedFriend === "" ? "Ouvrez une conversation pour envoyer un message" : `Envoyez un message à ${selectedFriend} `}`}
                                                onChange={(event) => {
                                                    if (selectedFriend !== "") {
                                                        setCurrentMessage(event.target.value);
                                                    }
                                                }}
                                                onKeyPress={(event) => {
                                                    // event.key === "Enter" && sendMessage();

                                                    if (selectedFriend !== "" && event.key === "Enter") {
                                                        sendMessage();
                                                    }
                                                }}
                                                readOnly={selectedFriend === ""}
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

