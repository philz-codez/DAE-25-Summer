// 1. Import required packages
const express = require('express');
const cors = require('cors');
const {OpenAI} = require ('openai');
require('dotenv').config();

// 2, Create Express app
const app = express();

// 3. use middleware
app.use(cors());
app.use(express.json());

// 4. Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

// 5. Create POST ednpoint to handle the chat messages