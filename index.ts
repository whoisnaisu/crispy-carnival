import axios from "axios";
import { log } from "console";
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

function promptToContinue() {
  rl.question("Do you want to download another book? (y/n): ", (answer) => {
    if (answer.toLowerCase() === "y") {
      startDownload();
    } else {
      rl.close();
    }
  });
}

function startDownload() {
  rl.question("Enter the book directory ID: ", (dirId) => {
    if (dirId.length > 5) {
      console.log(
        "Invalid directory ID. It should not have more than five characters."
      );
      startDownload();
      return;
    }

    rl.question("Enter the directory name you want to create: ", (dirName) => {
      dirName = dirName.replace(/[^a-zA-Z0-9]/g, "");

      directoryPath += dirName;

      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
      }
      let i = 1;
      let fetch = true;

      const fetchPage = async () => {
        try {
          if (!fetch) {
            promptToContinue();
            return;
          }
          const response = await axios.get(
            `http://readonline.ebookstou.org/flipbook/${dirId}/files/mobile/${i}.jpg`,
            { responseType: "arraybuffer" }
          );

          if (response.status === 200) {
            const filePath = path.join(directoryPath, `${i}.jpg`);
            fs.writeFileSync(filePath, response.data, "binary");
            console.log(`Downloaded ${filePath}`);
            i++;
            fetchPage();
          }
        } catch (error) {
          fetch = false;
          console.log("Ended of downloading process.");
          promptToContinue();
        }
      };
      fetchPage();
    });
  });
}

startDownload();
