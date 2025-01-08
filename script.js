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

async function ask_llm(q) {
    try {
        const response = await ollama.chat({
            model: "llama3.2:1b", 
            messages: [{ role: "user", content: q }],
        });

        const a = response.message.content;

        fs.writeFile('a.txt', a, (err) => {
            if (err) {
                throw err;
            }
            console.log("The AI's response has been saved to a.txt.");
        });
    } catch (err) {
        console.error("Error:", err);
    }
}

const question = fs.readFileSync("q.txt", 'utf8');
ask_llm(question);



