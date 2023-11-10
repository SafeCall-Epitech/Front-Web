function removeQuestionMarkFromName(name) {
    if (typeof name === 'string') {
      return name.replace(/^\?/, ''); // Remove question mark at the beginning
    } else {
      // Handle non-string values, such as undefined or null, as needed
      return name;
    }
  }

const [selectedFriend, setSelectedFriend] = useState(null);
const [actionResult, setActionResult] = useState('');

const handleDropdownSelect = (friend, action) => {
  setSelectedFriend(friend);

  if (action === 'option1') {
    removeQuestionMarkFromName(selectedFriend.name);
  } else {
    setActionResult('');
  }
  if (action === 'option2') {
    removeQuestionMarkFromName(selectedFriend.name);
  } else {
    setActionResult('');
  }
};




<MDBCol sm="6">
                <MDBCard className="mb-4">
                  <MDBCardBody>
                    <MDBCardText className="mb-4">
                      <span className="text-primary font-italic me-1">Friends List</span>
                    </MDBCardText>
                    <MDBListGroup>
                      {friendsList.map((friend) => (
                        <MDBListGroupItem key={friend.id}>
                          {friend.name}
                          <DropdownButton
                            title="Actions"
                            onSelect={(action) => handleDropdownSelect(friend, action)}
                            id={`dropdown-basic-${friend.id}`}
                          >
                            <Dropdown.Item eventKey="option1">Delete friend</Dropdown.Item>
                            <Dropdown.Item eventKey="option2">Report</Dropdown.Item>
                            {/* Add more options as needed */}
                          </DropdownButton>
                        </MDBListGroupItem>
                      ))}
                    </MDBListGroup>
                  </MDBCardBody>
                </MDBCard>
                {selectedFriend && (
                    {actionResult}
                )}
              </MDBCol>