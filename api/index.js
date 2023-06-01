const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");

const app = express();
const PORT = 30007;

app.use(cors());

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
    res.send(stdout);
  });
});

app.get("/getAllVotes", (req, res) => {
  const command =
    'peer chaincode query -o $ORDERER_ADDRESS --channelID evoting --name mychaincode -c \'{"Args":["getAllVotes"]}\'';

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      res.status(500).send("Error executing command");
      return;
    }
    console.log(`Command output: ${stdout}`);
    res.send(stdout);
  });
});

app.get("/castVote", (req, res) => {
  const voter = req.query.voter;
  const voted = req.query.voted;

  const command = `peer chaincode invoke -o $ORDERER_ADDRESS --channelID evoting --name mychaincode -c '{"Args":["castVote", "${voter}", "${voted}"]}'`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      res.status(500).send("Error executing command");
      return;
    }
    console.log(`Command output: ${stdout}`);
    res.send(stdout);
  });
});

app.get("/getVote", (req, res) => {
  const voter = req.query.voter;

  const command = `peer chaincode query -o $ORDERER_ADDRESS --channelID evoting --name mychaincode -c '{"Args":["getVote", "${voter}"]}'`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      res.status(500).send("Error executing command");
      return;
    }
    console.log(`Command output: ${stdout}`);
    res.send(stdout);
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
