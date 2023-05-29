const express = require("express");
const { exec } = require("child_process");

const app = express();
const PORT = 30007;

app.get("/invoke", (req, res) => {
  const command =
    'peer chaincode invoke -o $ORDERER_ADDRESS --channelID evoting --name mychaincode -c \'{"Args":["initLedger"]}\'';

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      res.status(500).send("Error executing command");
      return;
    }
    console.log(`Command output: ${stdout}`);
    res.send("Invoke command executed successfully");
  });
});

app.get("/query", (req, res) => {
  const command =
    'peer chaincode query -o $ORDERER_ADDRESS --channelID evoting --name mychaincode -c \'{"Args":["getAllVotes"]}\'';

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      res.status(500).send("Error executing command");
      return;
    }
    console.log(`Command output: ${stdout}`);
    res.send("Query command executed successfully");
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
