import { Center, Text, Box, Button, Flex, Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverFooter, PopoverArrow, PopoverCloseButton, Input} from '@chakra-ui/react';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import "./Calendar.css";

const eventDate = [
    { label: "1", value: "Fri Sep 30 2023" },
    { label: "2", value: "Thu Oct 13 2023" },
  ];

const CalendarPage = () => {
    const [date, setDate] = useState(new Date());
    const [showTime, setShowTime] = useState(false);
    const initRef = React.useRef()

    return (
        <>
            <Box p={15} m={50}>
                <Box pb={20}>
                </Box>
                    <Center>
                    <Calendar
                            locale="en-GB"
                            onChange={setDate}
                            value={date}
                            onClickDay={() => setShowTime(true)}
                            tileContent={({ date, view }) => {
                                if (view === 'month') {
                                const selectedDate = date.toDateString();
                                const hasEvent = eventDate.some((event) => event.value === selectedDate);
                                return hasEvent ? <div className="dot"></div> : null;
                                }
                            }}
                            />
                    </Center>
            </Box>
            <Center m={2}>
                <Text as='em' color="#FC6976" fontSize='lg'>{date.toDateString()}</Text>
            </Center>
            <Center>
            <Flex width={'600px'} justifyContent={'space-between'}>

              <Popover>
                    <PopoverTrigger>
                    <Center>
                        <Button bgColor="#29C9B3" color="white" width={'160px'}>Add an Event</Button>
                    </Center>
                    </PopoverTrigger>
                    <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton color="#000000"/>
                    <PopoverBody fontSize='lg' fontWeight={'bold'}   border-radius= '5px' >
                        Create
                        <Center p={'10px'}>
                            <Flex width={'200px'} justifyContent={'space-between'}>
                                <Input type="time"/>
                            </Flex>
                        </Center>
                        <Center>
                        <Input width={'200px'} placeholder='Object'/>
                        </Center>
                    </PopoverBody>
                    <PopoverFooter border='0' display='flex' justifyContent='right' pb={4}>
                    <Button bgColor="#00000" color="white">Submit</Button>
                    </PopoverFooter>
                    </PopoverContent>
                </Popover>

                <Popover>
                    <PopoverTrigger>
                    <Center>
                        <Button bgColor="#29C9B3" color="white" width={'160px'}>Daily Events</Button>
                    </Center>
                    </PopoverTrigger>
                    <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton color="#FC6976"/>
                    <PopoverBody pb={20} fontSize='lg' fontWeight={'bold'}>
                        Nothing Planned This Day
                    </PopoverBody>
                    <PopoverFooter border='0' display='flex' justifyContent='right' pb={4}>
                    </PopoverFooter>
                    </PopoverContent>
                </Popover>

                <Popover>
                    <PopoverTrigger>
                    <Center>
                        <Button bgColor="#29C9B3" color="white" width={'160px'} isDisabled>Edit/Delete an Event</Button>
                    </Center>
                    </PopoverTrigger>
                    <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton color="#FC6976"/>
                    <PopoverBody pb={20} fontSize='lg' fontWeight={'bold'}>
                        Create
                    </PopoverBody>
                    <PopoverFooter border='0' display='flex' justifyContent='right' pb={4}>
                    <Button bgColor="#29C9B3" color="white">Submit</Button>
                    </PopoverFooter>
                    </PopoverContent>
                </Popover>
            </Flex>
            </Center>
   </>);
}

export default CalendarPage;