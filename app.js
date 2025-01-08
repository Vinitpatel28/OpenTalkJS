const ollama = require('ollama');
const fs = require('fs');
const path = require('path');

async function askOllama(question) {
  try {
    const response = await ollama.chat({
      model: 'llama3.2:1b',
      messages: [{ role: 'user', content: question }],
    });
    return response.message.content;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

async function processBatchQuestions() {
  const questionsDir = './questions';
  const answersDir = './answers';

  if (!fs.existsSync(answersDir)) {
    fs.mkdirSync(answersDir);
  }

  try {
    const files = fs.readdirSync(questionsDir)
      .filter(file => file.startsWith('Q') && file.endsWith('.txt'))
      .sort();

    for (const file of files) {
      const match = file.match(/q(\d+)\.txt/);
      if (match) {
        const number = match[1];
        
        const question = fs.readFileSync(path.join(questionsDir, file), 'utf8');
        
        console.log(`Processing question ${number}...`);
        
        const answer = await askOllama(question);
        
        if (answer) {
          const answerFile = `a${number}.txt`;
          fs.writeFileSync(path.join(answersDir, answerFile), answer);
          console.log(`Answer ${number} has been written to ${answerFile}`);
        } else {
          console.log(`Failed to get answer for question ${number}`);
        }
      }
    }
    
    console.log('Batch processing completed');
  } catch (error) {
    console.error('Batch processing failed:', error);
  }
}

processBatchQuestions();