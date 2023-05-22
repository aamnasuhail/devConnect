import React from "react";
import { useState } from "react";
import CGLogo from "../../../assets/images/gptlogo.png";
import axios from "axios";
import "./chatbot.css";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  const chat = async (e, message) => {
    e.preventDefault();
    if (!message) return;
    setLoading(true);

    let msgs = chats;
    msgs.push({ role: "user", content: message });
    setChats(msgs);

    setMessage("");

    axios
      .post(
        "http://localhost:3200/chat",
        {
          chats,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        msgs.push(res.data.output);
        setChats(msgs);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="chatBot">
      <div className="message-history">
        {chats.length === 0 ? (
          <h2 className="chat-head">
            Hello, I am Devian, your personal AI code assistant, created by
            Aamna and Asjad. I'm here to help you with anything.
          </h2>
        ) : null}
        <section>
          {chats && chats.length
            ? chats.map((chat, index) => (
                <p
                  key={index}
                  className={chat.role === "user" ? "user_msg" : ""}
                >
                  <span className="gpt-para">
                    <b>{chat.role === "user" ? "You" : "Devian"}</b>
                    <span>:</span>
                    <span>{chat.content}</span>
                  </span>
                </p>
              ))
            : ""}
        </section>
      </div>
      <div className="input-wrapper">
        <form onSubmit={(e) => chat(e, message)} className="gpt-form-wrapper">
          <img
            src={CGLogo}
            alt=""
            className={loading ? "cg-logo loading" : "cg-logo"}
          />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask anything... :)"
          />
          <button type="submit">Ask</button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
