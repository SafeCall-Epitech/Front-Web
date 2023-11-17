import React, { useState } from 'react';
import DiscList from '../Chat_part/DiscList';
import Chat from '../Chat_part/Chat';
import '../Chat_part/style/Selection.css';

function MainComponent() {
    const [selectedFriend, setSelectedFriend] = useState("");

    const date = new Date();

    const currentOffsetMinutes = date.getTimezoneOffset();

    const currentDifferenceHours = currentOffsetMinutes / 60;

    sessionStorage.setItem("UTC", currentDifferenceHours);

    const handleFriendSelection = (friendName) => {
        setSelectedFriend(friendName);
    };

    return (
        <div style={{ display: 'flex', backgroundColor: 'lightgray' }} fluid className="py-5">
            <div style={{ flex: 1 }}>
                <DiscList onFriendSelect={handleFriendSelection} />
            </div>
            <div style={{ flex: 2 }}>
                <Chat selectedFriend={selectedFriend} />
            </div>
        </div>
    );
}

export default MainComponent;
