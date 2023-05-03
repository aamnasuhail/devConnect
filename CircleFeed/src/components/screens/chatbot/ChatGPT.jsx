import React from "react";
import { useState } from "react";
import CGLogo from "./chatGPT.png";
import AppLogo from "./app-logo.png";
import "./chatbot.css";

const API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = "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";
const SYSTEM_MESSAGE =
  "You are Devian, a helpful and versatile AI code assistant that helps in tech related topics created by Aamna and Asjad using state-of the art ML Models and APIs.";
const ChatGPT = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + API_KEY,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: SYSTEM_MESSAGE },
          { role: "user", content: prompt },
        ],
      }),
    });
    const responseJson = await response.json();
    setResponse(responseJson.choices[0].message.content);
    setLoading(false);
  };

  return (
    <div className="chatBot">
      <div className="wrapper">
        <img src={AppLogo} alt="" className="app-logo" />
        <form onSubmit={handleSubmit} className="form-wrapper">
          <img
            src={CGLogo}
            alt=""
            className={loading ? "cg-logo loading" : "cg-logo"}
          />
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

export default ChatGPT;
