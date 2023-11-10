// import "bootstrap/dist/css/bootstrap.min.css";
import '../Chat_part/style/Chat.css'
// import Card from 'react-bootstrap/Card';
import ScrollToBottom from "react-scroll-to-bottom";

export default function Print_message(props) {
    let utcstr = sessionStorage.getItem("UTC");
    let utc = parseFloat(utcstr)
    const d = new Date();
    console.log(d.getHours() + " " + utc)
    let hour = d.getHours()
    let min = d.getMinutes();

    return (



        <ScrollToBottom className="p_mess">
            {props._messageList.map((msg) =>
                <div className="contain"><div className={sessionStorage.getItem("user_name") === msg["Sender"] ? "me" : "other"}>{sessionStorage.getItem("user_name") === msg["Sender"] ? "me" + " : " + msg["Message"] : msg["Sender"] + " : " + msg["Message"]}</div>{msg["Heure"] ? (parseFloat(msg["Heure"].split(":")[0]) + -utc) + ":" + msg["Heure"].split(":")[1] : hour + ":" + min}</div>)}
            {/* <Card bg="info" style={{ width: '18rem' }}>{msg.username + " : " + msg.text}</Card>)}
                    <Card bg={sessionStorage.getItem("user_name") === msg.username ? "info" : "light"} style={{ width: '6rem' }}>{msg.username + " : " + msg.text}</Card>)} */}
        </ScrollToBottom>
    );

    //     <ScrollToBottom className="p_mess">
    //         {props._messageList.map((msg) => {
    //             const isUserMessage = sessionStorage.getItem("user_name") === msg["Sender"];
    //             const timeStyle = {
    //                 justifyContent: isUserMessage ? 'flex-end' : 'flex-start',
    //             };
    //             return (
    //                 <div className="contain">
    //                     <div className={isUserMessage ? "me" : "other"}>
    //                         {isUserMessage ? "me" + " : " + msg["Message"] : msg["Sender"] + " : " + msg["Message"]}
    //                     </div>
    //                     <div className="message-time" style={timeStyle}>
    //                         {msg["Heure"] ? msg["Heure"] : hour + ":" + min}
    //                     </div>
    //                 </div>
    //             );
    //         })}
    //     </ScrollToBottom>

    // );


}
