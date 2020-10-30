import React from "react";
import moment from "moment";
import "./Message.css";

export default function Message(props) {
  const {
    data,
    isMine,
    startsSequence,
    endsSequence,
    showTimestamp,
    author,
  } = props;

  const friendlyTimestamp = moment(data.timestamp).format("LLLL");
  return (
    <div
      className={[
        "message",
        `${isMine ? "mine" : ""}`,
        `${startsSequence ? "start" : ""}`,
        `${endsSequence ? "end" : ""}`,
      ].join(" ")}
      style={{ marginBottom: 5 }}
    >
      {showTimestamp && (
        <div className="blockcenter">
          <div className="timestamp">{friendlyTimestamp}</div>
        </div>
      )}

      <div className="bubble-container">
        {!isMine ? (
          <img
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "10px",
            }}
            alt="dp"
            src={`https://dummyimage.com/1024x576/2f353a/fff.jpg&text=${localStorage
              .getItem(author.toString())
              .charAt(0)}`}
          />
        ) : (
          <></>
        )}

        <div className="bubble" title={friendlyTimestamp}>
          {data.message}
        </div>
        {!isMine ? (
          <></>
        ) : (
          <img
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              objectFit: "cover",
              marginLeft: "10px",
            }}
            src={`https://dummyimage.com/1024x576/2f353a/ffffff.jpg&text=${localStorage
              .getItem("name")
              .charAt(0)}`}
            alt="dp"
          />
        )}
      </div>
    </div>
  );
}

// .conversation-list-item {
//   display: flex;
//   align-items: center;
//   padding: 10px;
// }
