import React, { useState } from 'react';
import DiscList from './DiscList';
import Chat from './Chat';
import '../style/Selection.css';

function MainComponent() {
    const [selectedFriend, setSelectedFriend] = useState("");

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
