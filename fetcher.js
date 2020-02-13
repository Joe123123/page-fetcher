const request = require("request");
const fs = require("fs");
const readline = require("readline");
const fetch = (url, filePath) => {
  const requestAndWrite = function(url, filePath) {
    request(url, (err, response, body) => {
      if (err) throw err;
      if (response.statusCode !== 200) {
        console.log(`ERROR. CODE:${response.statusCode}`);
        return;
      }
      fs.writeFile(filePath, body, () => {
        const stats = fs.statSync("index.html");
        const fileSizeInBytes = stats.size;
        console.log(
          `Downloaded and saved ${fileSizeInBytes} bytes to ${filePath}.`
        );
      });
    });
  };
  let path = filePath;
  fs.access(path, fs.constants.F_OK, err => {
    if (err) throw err;
  });
  if (fs.existsSync(path)) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(
      "File already exists,\nTo overwrite press Y and ENTER,\nTo give a new path press other keys and ENTER\nTo quit press Q and ENTER\n",
      function(key) {
        if (key === "y") {
          rl.close();
          requestAndWrite(url, path);
        } else if (key === "q") {
          rl.close();
          return;
        } else {
          rl.question("Enter a valid file path: ", filePath => {
            path = filePath;
            rl.close();
            fetch(url, path);
          });
        }
      }
    );
  } else {
    requestAndWrite(url, path);
  }
};

let arr = process.argv.slice(2);
fetch(arr[0], arr[1]);
