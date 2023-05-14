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
  organization: process.env.ORGANIZATION,
  apiKey: process.env.CHATBOT_KEY,
});

const openai = new OpenAIApi(configuration);
router.post("/chat", async (req, res) => {
  try {
    const { chats } = req.body;
    console.log(chats);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are Devian, a helpful and versatile AI code assistant that helps in tech related topics created by Aamna and Asjad using state-of the art ML Models and APIs.",
        },
        ...chats,
      ],
    });

    return res.status(200).json({ output: completion.data.choices[0].message });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ errMsg: "error in chatbot", error });
  }
});

module.exports = router;
