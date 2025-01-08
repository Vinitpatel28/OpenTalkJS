// import ollama from "ollama";

// async function runChat() {
//   try {
//     const response = await ollama.chat({
//       model: "llama3.2:1b",
//       messages: [{ role: 'user', content: "Write product descriptions" }]
//     });

//     console.log("Chatbot Response:", response.message.content);
//   } catch (error) {
//     console.error("Error occurred:", error.message);
//   }
// }

// runChat();


// ------------------------------------------------------------------
//Stage 2:
// ------------------------------------------------------------------

import fs from 'fs';
import ollama from "ollama";

async function processChat() {
    try {
        const questionFile = "q.txt";
        const userMessage = fs.readFileSync(questionFile, "utf-8");

        const aiResponse = await ollama.chat({
            model: "llama3.2:1b",
            messages: [{ role: "user", content: userMessage }],
        });

        const responseMessage = aiResponse.message.content;

        const answerFile = "a.txt";
        fs.writeFileSync(answerFile, responseMessage, "utf-8");

        console.log("The AI's response has been saved to a.txt.");
    } catch (error) {
        console.error("Error encountered:", error.message);
    }
}

processChat();


