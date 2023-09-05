import axios from "axios";
import fs from "fs";
import path from "path";
import readline from "readline";

let directoryPath = "./images/";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath);
}

rl.question("Enter the book ID: ", (dirId) => {
  if (dirId.length > 5) {
    console.log(
      "Invalid directory ID. It should not have more than five characters."
    );
    rl.close();
    return;
  }

  directoryPath += dirId;

  rl.question("Enter the number of pages to download: ", (input) => {
    const numPages = parseInt(input);

    if (isNaN(numPages) || numPages <= 0) {
      console.log("Invalid input. Please enter a positive integer.");
      rl.close();
      return;
    }

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath);
    }

    for (let i = 1; i <= numPages; i++) {
      axios
        .get(
          `http://readonline.ebookstou.org/flipbook/${dirId}/files/mobile/${i}.jpg`,
          { responseType: "arraybuffer" }
        )
        .then((response) => {
          if (response.status === 200) {
            const filePath = path.join(directoryPath, `${i}.jpg`);
            fs.writeFileSync(filePath, response.data, "binary");
            console.log(`Downloaded ${filePath}`);
          } else {
            console.log(
              `Failed to download page ${i}. Status code: ${response.status}`
            );
          }
        })
        .catch((error) => {
          console.log(
            `Error downloading page ${i}: ${error.message} \n`,
            error
          );
        });
    }

    rl.close();
  });
});
