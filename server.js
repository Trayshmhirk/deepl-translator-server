const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000;
const DEEPL_API_KEY = process.env.DEEPL_API_KEY; // Load API key from environment variable

app.use(bodyParser.json());

// Enable CORS middleware
app.use(cors());

app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/translate", async (req, res) => {
   const { content, targetLanguage } = req.body;

   try {
      const response = await fetch(
         `https://api.deepl.com/v2/translate?auth_key=${DEEPL_API_KEY}`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               text: [content], // Wrap the content in an array
               target_lang: targetLanguage,
            }),
         }
      );

      const data = await response.json();

      if (data.translations && data.translations.length > 0) {
         res.json({ translatedText: data.translations[0].text });
      } else {
         res.status(500).json({ error: "Translation failed" });
      }
   } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred during translation" });
   }
});

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
