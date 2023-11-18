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
    MDBListGroupItem
} from 'mdb-react-ui-kit';
import axios from 'axios';

import { DropdownButton, Dropdown } from 'react-bootstrap';
import { Uploader } from "uploader";
import { UploadDropzone } from "react-uploader";

export default function ProfilePage() {

    const user = JSON.parse(localStorage.getItem('user'));
    sessionStorage.setItem("user_name", JSON.parse(localStorage.getItem('user')).toLowerCase())

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

    const [friendsList, setFriendsList] = useState([]);
    const [agenda, setAgenda] = useState([]);


    const uploader = Uploader({
        apiKey: "free"
    });

    const options = { multi: true };

    useEffect(() => {
        const fetchFriendsList = async () => {
            try {
                const response = await axios.get(`http://20.234.168.103:8080/listFriends/${user}`);
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
                const res2 = await axios.get(`http://20.234.168.103:8080/listEvent/${user}`)

                const data = res2.data["Success "];
                console.log(data);

                if (data && data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const event = data[i];
                        const guests = event.Guests;
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
            await axios.post(`http://20.234.168.103:8080/manageFriend`, form, {
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
            // await axios.post(`http://20.234.168.103:8080/manageFriend`, form, {
            //     headers: {
            //         'Content-Type': 'application/json',
            //     }
            // });

            const response = await axios.get('http://20.234.168.103:8080/messages/' + sessionStorage.getItem("user_name") + "/" + friend.id.toLowerCase());

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
            axios.post(`http://20.234.168.103:8080/profileFullName`, form, {
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
            axios.post(`http://20.234.168.103:8080/profilePhoneNB`, form, {
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
            axios.post(`http://20.234.168.103:8080/profileDescription`, form, {
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
            axios.post(`http://20.234.168.103:8080/profileEmail`, form, {
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
            axios.post(`http://20.234.168.103:8080/profilePic`, form, {
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
                const res = await axios.get(`http://20.234.168.103:8080/profile/${user}`);
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

        if (action === 'option1') {
            DeleteFriend(friend);
        } else {
            setActionResult('');
        }
        if (action === 'option2') {
            DeleteFriend(friend);
        } if (action === 'option3') {
            SendConv(friend);
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
                                                window.location.href = '/Login';
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
                                                    ---
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
                                                <MDBListGroupItem key={friend.id}>
                                                    {friend.id}
                                                    <DropdownButton
                                                        title="Actions"
                                                        onSelect={(action) => handleDropdownSelect(friend, action)}
                                                        id={`dropdown-basic-${friend.id}`}
                                                    >
                                                        <Dropdown.Item eventKey="option1">Delete friend</Dropdown.Item>
                                                        <Dropdown.Item eventKey="option2">Report</Dropdown.Item>
                                                        <Dropdown.Item eventKey="option3">Start Conversation</Dropdown.Item>
                                                        {/* Add more options as needed */}
                                                    </DropdownButton>
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
        </section >
    );
}