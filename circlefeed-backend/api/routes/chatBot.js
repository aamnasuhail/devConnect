const express = require("express");
const router = express.Router();

require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

// Set up the server ////////////

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Set up OpenAI endpoint

const configuration = new Configuration({
    apiKey: process.env.CHATBOT_KEY,
});

const openai = new OpenAIApi(configuration);
router.post("/chat", async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log(prompt);
        const completion = await openai.createCompletion({
            model: "GPT-3.5",
            prompt: prompt,
            max_tokens: 1500,
        });
        res.send(completion.data.choices[0].text);
        // res.send("i m here");
    } catch (error) {
        console.log("error", error);
        res.status(400).json({ errMsg: "error in chatbot", error });
    }
});

module.exports = router;
