// import fs from 'fs';
// import ollama from 'ollama';

// let q;
// let n = 5;

// async function LLM_query(q, i) {
//     const response = await ollama.chat({
//         model: "llama3.2:1b",
//         messages: [{ role: "user", content: q }],
//     });

//     let a = response.message.content;
//     const outputFilePath = `./answers/a${i}.txt`;  
//     fs.writeFile(outputFilePath, a, (err) => {
//         if (err) {
//             throw err;
//         } else {
//             console.log(`Answer ${i} is given`);        }
//     });
// }

// for (let i = 1; i <= n; i++) {
//     const inputFilePath = `./questions/q${i}.txt`;  
//     q = fs.readFileSync(inputFilePath, 'utf8');
//     LLM_query(q, i);
// }




//Task 4
import ollama from "ollama";
import fs from "fs";
import path from "path";

async function askToOllama(content) {
  try {
    const response = await ollama.chat({
      model: 'llama3.2:1b',
      messages: [{ role: 'user', content: content }],
    });
    return response;
  } catch (error) {
    throw new Error(`Error with Ollama: ${error.message}`);
  }
}

function checkCategoryExists(categoryPath, callback) {
  fs.access(categoryPath, fs.constants.F_OK, (err) => {
    if (err) {
      callback(false);
    } else {
      callback(true);
    }
  });
}

function readFilesInDirectory(directoryPath, callback) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      callback(null, err);
    } else {
      callback(files, null);
    }
  });
}

function readFileContent(filePath, callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      callback(null, err);
    } else {
      callback(data, null);
    }
  });
}

function writeToFile(filePath, content, callback) {
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      callback(false, err);
    } else {
      callback(true, null);
    }
  });
}

function main() {
  const category = process.argv[2]; 
  const questionNumber = process.argv[3]; 

  if (!category) {
    console.error("Please provide a category (e.g., 'academic', 'professional', 'creative').");
    process.exit(1);
  }

  const questionsDirPath = `./questions/${category}`;
  const answersDirPath = `./answers`;

  checkCategoryExists(questionsDirPath, (categoryExists) => {
    if (!categoryExists) {
      console.error(`Category '${category}' does not exist. Please check the directory.`);
      process.exit(1);
    }

    readFilesInDirectory(questionsDirPath, (questionFiles, err) => {
      if (err) {
        console.error(`Error reading question files: ${err.message}`);
        process.exit(1);
      }

      console.log(`Available question files in category '${category}':`, questionFiles);

      if (questionFiles.length === 0) {
        console.error(`No questions found in the '${category}' category.`);
        process.exit(1);
      }

      let selectedFile;
      if (questionNumber) {
        const normalizedQuestionNumber = `q${questionNumber}.txt`.toLowerCase();
        console.log(`Attempting to select file: ${normalizedQuestionNumber}`);

        selectedFile = questionFiles.find(file => file.toLowerCase() === normalizedQuestionNumber);

        if (!selectedFile) {
          console.error(`Question '${normalizedQuestionNumber}' does not exist in the '${category}' category.`);
          process.exit(1);
        }
      } else {
        const randomIndex = Math.floor(Math.random() * questionFiles.length);
        selectedFile = questionFiles[randomIndex];
        console.log(`Randomly selected file: ${selectedFile}`);
      }

      const questionFilePath = path.join(questionsDirPath, selectedFile);
      readFileContent(questionFilePath, (questionContent, err) => {
        if (err) {
          console.error(`Error reading question file: ${err.message}`);
          process.exit(1);
        }

        askToOllama(questionContent).then((ollamaResponse) => {
          fs.mkdir(answersDirPath, { recursive: true }, (err) => {
            if (err) {
              console.error(`Error creating answer directory: ${err.message}`);
              process.exit(1);
            }

            const answerFileName = selectedFile.replace("Q", "A");
            const answerFilePath = path.join(answersDirPath, answerFileName);

            writeToFile(answerFilePath, ollamaResponse.message.content, (success, err) => {
              if (err) {
                console.error(`Error writing answer file: ${err.message}`);
                process.exit(1);
              }

              if (success) {
                console.log(`Answer saved to: ${answerFilePath}`);
              }
            });
          });
        }).catch((error) => {
          console.error("Error with Ollama:", error.message);
          process.exit(1);
        });
      });
    });
  });
}

main();
