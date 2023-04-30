import React from "react";
import { useState } from "react";
import CGLogo from "./chatGPT.png";
import AppLogo from "./app-logo.png";

import "./chatbot.css";

import axios from "axios";

const Chatbot = () => {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        axios
            .post("http://localhost:3200/chat", { prompt })
            .then((res) => {
                setResponse(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <div className="chatBot">
            <div className="wrapper">
                <img src={AppLogo} alt="" className="app-logo" />
                <form onSubmit={handleSubmit}>
                    <img src={CGLogo} alt="" className={loading ? "cg-logo loading" : "cg-logo"} />
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ask anything... :)"
                    />
                    <button type="submit">Ask</button>
                </form>
                <p className="response-area">{loading ? "loading..." : response}</p>
                <div className="footer">~ AsjadEzazi ~</div>
            </div>
        </div>
    );
};

export default Chatbot;
