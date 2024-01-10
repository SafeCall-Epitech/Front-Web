import { Center, Text, Box, Button, Flex, Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverFooter, PopoverArrow, PopoverCloseButton, Input } from '@chakra-ui/react';
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
import React, { useState, useEffect } from 'react';

import Calendar from 'react-calendar';
import "./Calendar.css";

export default function CalendarPage() {


    const user = JSON.parse(localStorage.getItem('user'));
    sessionStorage.setItem("user_name", JSON.parse(localStorage.getItem('user')).toLowerCase())
    const [date, setDate] = useState(new Date());
    const [agenda, setAgenda] = useState([]);
    const [eventDate, setEventDate] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);

    const [showTime, setShowTime] = useState(false);
    const initRef = React.useRef();


    useEffect(() => {
        const fetchAgenda = async () => {
            try {
                const res2 = await axios.get(`https://x2024safecall3173801594000.westeurope.cloudapp.azure.com/listEvent/${user}`)

                const data = res2.data["Success "];
                console.log("Data : ", data);

                
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
                console.log("Date : ", date)


            } catch (error) {
                console.log("error : ");

                console.error(error);
            }
        };

        fetchAgenda();
    }, []);

    const filterEventsByDate = () => {
        const selectedDateString = date.toDateString();
        const filtered = agenda.filter((event) => {
            const eventDateString = new Date(event.Date).toDateString();
            if (eventDateString === selectedDateString) {
                console.log("Same Date");
                return true;
            }
            return false;
        });
        setFilteredEvents(filtered);
    };

    console.log("Date Value: ", date); // Add this line to log the date value


    return (
        <>
            <Box p={15} m={50}>
                <Box pb={20}></Box>
                <Center>
                    <Calendar
                        locale="en-GB"
                        onChange={setDate}
                        value={date}
                        onClickDay={() => setShowTime(true)}
                        tileContent={({ date, view }) => {
                            if (view === 'month') {
                                const selectedDate = date.toDateString();
                                const hasEvent = agenda.some((event) => {
                                    const eventDateString = new Date(event.Date).toDateString();
                                    return eventDateString === selectedDate;
                                });
                                return hasEvent ? <div className="dot"></div> : null;
                            }
                        }}
                    />
                </Center>
            </Box>
                <Center m={2}>
                    <Text as='em' color="#FC6976" fontSize='lg'>{date.toLocaleDateString()}</Text>
                </Center>
            <Center>
                <Flex width={'600px'} justifyContent={'space-between'}>
                    
                    <Popover>
                        <PopoverTrigger>
                            <Center>
                                <Button
                                    class="ripple ripple-surface btn btn-dark btn-rounded btn-mg btn-block"
                                    width={'160px'}
                                    onClick={filterEventsByDate}
                                >
                                    Daily Events
                                </Button>
                            </Center>
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton color="#FC6976" />
                            <PopoverBody pb={20} fontSize='lg' fontWeight={'bold'}>
                                {filteredEvents.length > 0 ? (
                                    filteredEvents.map((event, index) => (
                                        <div key={index}>
                                            Guests: {event.Guests} <br />
                                            Subject: {event.Subject}
                                        </div>
                                    ))
                                ) : (
                                    "Nothing Planned This Day"
                                )}
                            </PopoverBody>
                            <PopoverFooter border='0' display='flex' justifyContent='right' pb={4}></PopoverFooter>
                        </PopoverContent>
                    </Popover>
    
                    <Popover>
                        <PopoverTrigger>
                            <Center>
                                <Button
                                    class="ripple ripple-surface btn btn-dark btn-rounded btn-mg btn-block"
                                    width={'160px'}
                                >
                                    Edit/Delete an Event
                                </Button>
                            </Center>
                        </PopoverTrigger>
                        {/* ... Edit/Delete Event Popover Content (unchanged) ... */}
                    </Popover>
                </Flex>
            </Center>
        </>
    );
    
}