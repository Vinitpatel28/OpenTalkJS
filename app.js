import fs from 'fs';
import ollama from 'ollama';

let q;
let n = 5;

async function LLM_query(q, i) {
    const response = await ollama.chat({
        model: "llama3.2:1b",
        messages: [{ role: "user", content: q }],
    });

    let a = response.message.content;
    const outputFilePath = `./answers/a${i}.txt`;  
    fs.writeFile(outputFilePath, a, (err) => {
        if (err) {
            throw err;
        } else {
            console.log(`Answer ${i} is given`);        }
    });
}

for (let i = 1; i <= n; i++) {
    const inputFilePath = `./questions/q${i}.txt`;  
    q = fs.readFileSync(inputFilePath, 'utf8');
    LLM_query(q, i);
}