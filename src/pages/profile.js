import React, { useState, useEffect } from 'react';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBBtn,
    MDBIcon,
    MDBListGroup,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalBody,
    MDBTypography,
    MDBListGroupItem
} from 'mdb-react-ui-kit';
import axios from 'axios';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker";
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { Uploader } from "uploader";
import { UploadDropzone } from "react-uploader";
import { useNavigate } from 'react-router-dom';


export default function ProfilePage() {

    const user = JSON.parse(localStorage.getItem('user'));
    sessionStorage.setItem("user_name", JSON.parse(localStorage.getItem('user')).toLowerCase())


    const [username, setUsername] = useState('');
    const [Name, setName] = useState('');
    const [Email, setEmail] = useState('');
    const [Nb, setNb] = useState('');
    const [Description, setDescription] = useState('');
    const [ProfilePic, setProfilePic] = useState("https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png");

    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(Name);
    const [newEmail, setNewEmail] = useState(Email);
    const [newNb, setNewNb] = useState(Nb);
    const [newDescription, setNewDescription] = useState(Description);
    const [showCallModal, setShowCallModal] = useState(false);
    const [Subject, setSubject] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [Priority, setPriority] = useState('low'); // Provide an initial value here
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('10:00 AM');

    const [friendsList, setFriendsList] = useState([]);
    const [agenda, setAgenda] = useState([]);
    const [Guest, setGuest] = useState("");

    const navigate = useNavigate();

    const uploader = Uploader({
        apiKey: "free"
    });

    const options = { multi: true };

    useEffect(() => {
        const fetchFriendsList = async () => {
            try {
                const response = await axios.get(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/listFriends/${user}`);
                const fetchedData = response.data.fetched;

                const friendsListData = fetchedData.map(friend => ({
                    id: friend.Id,
                    subject: friend.Subject,
                    active: friend.Active
                }));

                setFriendsList(friendsListData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchFriendsList();
    }, []);

    useEffect(() => {
        const fetchAgenda = async () => {
            try {
                const res2 = await axios.get(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/listEvent/${user}`)

                const data = res2.data["Success "];
                console.log(data);

                if (data && data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const event = data[i];
                        const guests = user + event.Guests;
                        const date = event.Date;
                        const subject = event.Subject;
                        const Event = event.Guests + " / " + event.Date + " / " + event.Subject;
                    }
                }
                setAgenda(data);

            } catch (error) {
                console.error(error);
            }
        };

        fetchAgenda();
    }, []);

    const SendCallForm = async () => {
        const form = JSON.stringify({
            guest1: user,
            guest2: username,
            subject: Subject,
            date: selectedDate.toISOString(),
            time: selectedTime + 1,
        });
        console.log(selectedTime);

        axios
            .post(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/addEvent`, form, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                console.log(res.data);
                setShowCallModal(false); // Close the modal here
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleCloseCallModal = () => {
        setShowCallModal(false);
    };

    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setNewEmail(e.target.value);
    };

    const handlePhoneNBchange = (e) => {
        setNewNb(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setNewDescription(e.target.value);
    };

    const DeleteFriend = async (friend) => {
        try {
            const form = JSON.stringify({
                UserID: user,
                Friend: friend.id,
                Subject: friend.subject,
                Action: "delete",
            });
            await axios.post(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/manageFriend`, form, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

        } catch (err) {
            console.error(err);
        }
        console.log(friend);
    };
    const SendConv = async (friend) => {
        try {
            const form = JSON.stringify({
                UserID: user,
                Friend: friend.id,
                Subject: friend.subject,
                Action: "delete",
            });
            // await axios.post(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/manageFriend`, form, {
            //     headers: {
            //         'Content-Type': 'application/json',
            //     }
            // });

            const response = await axios.get('https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/messages/' + sessionStorage.getItem("user_name") + "/" + friend.id.toLowerCase());

        } catch (err) {
            console.error(err);
        }
        console.log(friend);
    };
    const handleNameSave = async () => {
        try {
            const form = JSON.stringify({
                UserID: user,
                Data: newName,
            });
            axios.post(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/profileFullName`, form, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePhoneNBSave = async () => {
        try {
            const form = JSON.stringify({
                UserID: user,
                Data: newNb,
            });
            axios.post(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/profilePhoneNB`, form, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    };
    const handleDescriptionSave = async () => {
        try {
            const form = JSON.stringify({
                UserID: user,
                Data: newDescription,
            });
            axios.post(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/profileDescription`, form, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEmailSave = async () => {
        try {
            const form = JSON.stringify({
                UserID: user,
                Data: newEmail,
            });
            axios.post(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/profileEmail`, form, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleProfilePicSave = async (fileUrl) => {
        try {
            const form = JSON.stringify({
                UserID: user,
                Data: fileUrl,
            });
            axios.post(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/profilePic`, form, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setNewName(Name);
        setNewEmail(Email);
        setNewNb(Nb);
        setNewDescription(Description);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/profile/${user}`);
                setName(res.data['profile']['FullName']);
                setEmail(res.data['profile']['Email']);
                setNb(res.data['profile']['PhoneNb']);
                setDescription(res.data['profile']['Description']);
                if (res.data['profile']['ProfilePic'])
                    setProfilePic(res.data['profile']['ProfilePic']);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const uploaderOptions = {
        multi: true,

        // Comment out this line & use 'onUpdate' instead of 
        // 'onComplete' to have the dropzone close after upload.
        showFinishButton: true,

        styles: {
            colors: {
                primary: "#377dff"
            }
        }
    }

    const handleJoinCall = (guests) => {
        const guestArray = guests.split('+');
        const firstGuest = guestArray[0];
        const secondGuest = guestArray[1];
    
        let guestName = (firstGuest === user) ? secondGuest : firstGuest;
        navigate(`/Call/${guestName}`);
    };

    const MyDropzone = ({ setFiles }) =>
        <UploadDropzone uploader={uploader}
            options={uploaderOptions}
            onComplete={setFiles}
            width="500px"
            height="200px" />

    const MyUploadedFiles = ({ files }) => files.map(file => {
        // Tip: save 'filePath' to your DB (not 'fileUrl').
        const filePath = file.filePath
        // "raw" for un-transformed file.
        const fileUrl = uploader.url(filePath, "thumbnail")
        setProfilePic(fileUrl);
        handleProfilePicSave(fileUrl);
    })
    const [files, setFiles] = useState([])

    const [selectedFriend, setSelectedFriend] = useState(null);
    const [actionResult, setActionResult] = useState('');

    const handleDropdownSelect = (friend, action) => {
        setUsername(friend.id); // Set the username here

        if (action === 'option1') {
            DeleteFriend(friend);
        } else {
            setActionResult('');
        }
        if (action === 'option2') {
            DeleteFriend(friend);
        } if (action === 'option3') {
            SendConv(friend);
        } if (action === 'option4') {
            navigate(`/My_wfriend_profile/${Name}`);
        } if (action === 'option5') {
            ``
            setModalShow(true);
            setShowCallModal(true);
        }


        else {
            setActionResult('');
        }
    };

    return (
        <section style={{ top: '0', bottom: '0', right: '0', left: '0', backgroundColor: '#E6E6E6' }}>
            <MDBContainer className="py-5">
                <MDBRow>
                    <MDBCol lg="4">
                        <MDBCard className="mb-4">
                            <MDBCardBody className="text-center">
                                <MDBCardImage
                                    src={ProfilePic}
                                    alt="avatar"
                                    className="rounded-circle"
                                    style={{ width: '170px' }}
                                    fluid
                                />
                                {isEditing && (
                                    <>
                                        {files.length
                                            ? <MyUploadedFiles files={files} />
                                            : <MyDropzone setFiles={setFiles} />
                                        }
                                    </>
                                )}

                                <MDBCardText>{Name}</MDBCardText>
                                <p className="@ID : *******">@ID : *******</p>
                                <div className="d-flex justify-content-center mb-2">
                                    <MDBBtn color="dark" rounded block size="mg" onClick={() => setIsEditing(true)}>
                                        <MDBIcon far icon="cog" /> Modify
                                    </MDBBtn>
                                </div>

                                <div className="d-flex justify-content-center mb-2">
                                    {user && (
                                        <MDBBtn color="danger" rounded block size="mg" onClick={() => {
                                            const confirmed = window.confirm('Are you sure you want to disconnect?');
                                            if (confirmed) {
                                                localStorage.removeItem('user');
                                                window.location.href = '/login';
                                            }
                                        }}>
                                            <MDBIcon fas icon="sign-out-alt" /> Disconnect
                                        </MDBBtn>
                                    )}
                                </div>
                            </MDBCardBody>
                        </MDBCard>

                        <MDBCard className="mb-4 mb-lg-0">
                            <MDBCardBody>
                                <MDBCardText className="mb-4">
                                    <span className="text-primary font-italic me-1">Description</span>
                                    <MDBCol sm="14">
                                        {isEditing ? (
                                            <div className="d-flex justify-content-start mb-2">
                                                <input type="text" value={newDescription} onChange={handleDescriptionChange} />
                                                <MDBBtn color="black" className="ms-3" onClick={handleDescriptionSave}>Save</MDBBtn>
                                            </div>
                                        ) : (
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <MDBCardText className="text-muted">{Description}</MDBCardText>
                                            </div>
                                        )}
                                    </MDBCol>
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>

                    <MDBCol lg="8">
                        <MDBCard className="mb-4">
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Full Name</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        {isEditing ? (
                                            <div className="d-flex justify-content-start mb-2">
                                                <input type="text" value={newName} onChange={handleNameChange} />
                                                <MDBBtn color="black" className="ms-3" onClick={handleNameSave}>Save</MDBBtn>
                                            </div>
                                        ) : (
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <MDBCardText className="text-muted">{Name}</MDBCardText>
                                            </div>
                                        )}
                                    </MDBCol>
                                </MDBRow>
                                <hr />

                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>ID SafeCall</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">MyIdTest</MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                                <hr />

                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Email</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        {isEditing ? (
                                            <div className="d-flex justify-content-start mb-2">
                                                <input type="text" value={newEmail} onChange={handleEmailChange} />
                                                <MDBBtn color="black" className="ms-3" onClick={handleEmailSave}>Save</MDBBtn>
                                            </div>
                                        ) : (
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <MDBCardText className="text-muted">{Email}</MDBCardText>
                                            </div>
                                        )}
                                    </MDBCol>
                                </MDBRow>
                                <hr />

                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Phone Nb</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        {isEditing ? (
                                            <div className="d-flex justify-content-start mb-2">
                                                <input type="text" value={newNb} onChange={handlePhoneNBchange} />
                                                <MDBBtn color="black" className="ms-3" onClick={handlePhoneNBSave}>Save</MDBBtn>
                                            </div>
                                        ) : (
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <MDBCardText className="text-muted">{Nb}</MDBCardText>
                                            </div>
                                        )}
                                    </MDBCol>
                                </MDBRow>
                                <hr />

                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Password</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">********</MDBCardText>
                                    </MDBCol>
                                </MDBRow>

                                {isEditing && (
                                    <div className="d-flex justify-content-center mt-4">
                                        <MDBBtn color="danger" onClick={handleCancel}>
                                            Cancel
                                        </MDBBtn>
                                    </div>
                                )}
                            </MDBCardBody>
                        </MDBCard>

                        <MDBRow>
                            <MDBCol sm="6">
                                <MDBCard className="mb-4">
                                    <MDBCardBody>
                                        <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">Next on the Agenda</span></MDBCardText>
                                        <ul>
                                            {agenda && agenda.map((event, index) => (
                                                <li key={index}>
                                                    Guests: {event.Guests}<br />
                                                    Date: {event.Date}<br />
                                                    Subject: {event.Subject}<br />
                                                    Confirmed: {event.Confirmed ? "Yes" : "No"}<br />
                                                    <MDBBtn
                                                        color="dark"
                                                        onClick={() => handleJoinCall(event.Guests)} // Pass guests to the function
                                                        style={{ marginTop: "10px" }}
                                                    >
                                                        <i className="fas fa-phone"></i> Join Call
                                                    </MDBBtn>
                                                </li>
                                            ))}
                                        </ul>
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                            <MDBCol sm="6">
                                <MDBCard className="mb-4">
                                    <MDBCardBody>
                                        <MDBCardText className="mb-4">
                                            <span className="text-primary font-italic me-1">Friends List</span>
                                        </MDBCardText>
                                        <MDBListGroup>
                                            {friendsList.map((friend) => (
                                                <MDBListGroupItem key={friend.id} className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        {friend.id}
                                                    </div>
                                                    <div>
                                                        <DropdownButton
                                                            title="Actions"
                                                            onSelect={(action) => handleDropdownSelect(friend, action)}
                                                            id={`dropdown-basic-${friend.id}`}
                                                        >
                                                            <Dropdown.Item eventKey="option1">Delete friend</Dropdown.Item>
                                                            <Dropdown.Item eventKey="option2">Report</Dropdown.Item>
                                                            <Dropdown.Item eventKey="option3">Start Conversation</Dropdown.Item>
                                                            <Dropdown.Item eventKey="option4">Profile</Dropdown.Item>
                                                            <Dropdown.Item eventKey="option5">Book a Call</Dropdown.Item>
                                                        </DropdownButton>
                                                    </div>
                                                </MDBListGroupItem>
                                            ))}
                                        </MDBListGroup>

                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                        </MDBRow>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>


            {/* Modal for Booking a Call */}
            <MDBModal show={showCallModal} tabIndex="-1" onClick={handleCloseCallModal}>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalBody onClick={(e) => e.stopPropagation()}>
                            <MDBCard style={{ borderRadius: '15px', backgroundColor: '#E6E6E6' }}>
                                <MDBCardBody className="p-4 text-black">
                                    <p className="lead fw-normal mb-1">Call Form</p>
                                    <br />

                                    <MDBTypography tag="h5" className="mb-2">
                                        To {username}
                                    </MDBTypography>
                                    <br />
                                    <label htmlFor="name">Subject:</label>
                                    <br />
                                    <input
                                        type="text"
                                        value={Subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                    />
                                    <br />
                                    <br />
                                    <label htmlFor="name">Date:</label>
                                    <br />
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) => setSelectedDate(date)}
                                        dateFormat="dd/MM/yyyy"
                                        style={{
                                            backgroundColor: '#007bff',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s ease',
                                        }}
                                    />
                                    <br />
                                    <br />
                                    <label htmlFor="time">Time:</label>
                                    <br />
                                    <TimePicker
                                        onChange={setSelectedTime}
                                        value={selectedTime}
                                        format="h:mm a"
                                        clearIcon={null}
                                        clockIcon={null}
                                        disableClock={true}
                                        style={{
                                            backgroundColor: '#007bff',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s ease',
                                        }}
                                    />
                                    <br />
                                    <br />
                                    <MDBBtn
                                        color="primary"
                                        rounded
                                        size="lg"
                                        onClick={() => {
                                            SendCallForm();
                                            setModalShow(false);
                                        }}
                                    >
                                        - Send Form
                                    </MDBBtn>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBModalBody>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>

        </section>
    );
}
