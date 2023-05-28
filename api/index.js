/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

const grpc = require("@grpc/grpc-js");
const {
  connect,
  Identity,
  Signer,
  signers
} = require("@hyperledger/fabric-gateway");
const crypto = require("crypto");
const fs = require("fs").promises;
const path = require("path");
const { TextDecoder } = require("util");

let channelName = envOrDefault("CHANNEL_NAME", "evoting");
let chaincodeName = envOrDefault("CHAINCODE_NAME", "mychaincode");
let mspId = envOrDefault("MSP_ID", "EventsMSP");

// Path to crypto materials.
let cryptoPath = envOrDefault(
  "CRYPTO_PATH",
  path.resolve(
    __dirname,
    "..",
    "config",
    "crypto-config",
    "peerOrganizations",
    "events.example.com"
  )
);

// Path to user private key directory.
let keyDirectoryPath = envOrDefault(
  "KEY_DIRECTORY_PATH",
  path.resolve(
    cryptoPath,
    "users",
    "Admin@events.example.com",
    "msp",
    "keystore"
  )
);

// Path to user certificate.
let certPath = envOrDefault(
  "CERT_PATH",
  path.resolve(
    cryptoPath,
    "users",
    "Admin@events.example.com",
    "msp",
    "signcerts",
    "Admin@events.example.com-cert.pem"
  )
);

// Path to peer tls certificate.
let tlsCertPath = envOrDefault(
  "TLS_CERT_PATH",
  path.resolve(cryptoPath, "peers", "peer0.events.example.com", "tls", "ca.crt")
);

// Gateway peer endpoint.
let peerEndpoint = envOrDefault("PEER_ENDPOINT", "35.184.173.190:30751");

// Gateway peer SSL host name override.
let peerHostAlias = envOrDefault("PEER_HOST_ALIAS", "peer0-events-0");

const utf8Decoder = new TextDecoder();
let assetId = `asset${Date.now()}`;

async function main() {
  await displayInputParameters();

  // The gRPC client connection should be shared by all Gateway connections to this endpoint.
  const client = await newGrpcConnection();

  const gateway = connect({
    client,
    identity: await newIdentity(),
    signer: await newSigner(),
    // Default timeouts for different gRPC calls
    evaluateOptions: () => {
      return { deadline: Date.now() + 60000 }; // 5 seconds
    },
    endorseOptions: () => {
      return { deadline: Date.now() + 60000 }; // 15 seconds
    },
    submitOptions: () => {
      return { deadline: Date.now() + 60000 }; // 5 seconds
    },
    commitStatusOptions: () => {
      return { deadline: Date.now() + 60000 }; // 1 minute
    }
  });

  try {
    // Get a network instance representing the channel where the smart contract is deployed.
    const network = gateway.getNetwork(channelName);

    // Get the smart contract from the network.
    const contract = network.getContract(chaincodeName);

    // Initialize a set of asset data on the ledger using the chaincode 'InitLedger' function.
    await initLedger(contract);

    // const result = await contract.evaluateTransaction("getAllVotes");
    // console.log(`*** Result: ${result.toString()}`);

    // // Return all the current assets on the ledger.
    // await getAllAssets(contract);

    // // Create a new asset on the ledger.
    // await createAsset(contract);

    // // Update an existing asset asynchronously.
    // await transferAssetAsync(contract);

    // // Get the asset details by assetID.
    // await readAssetByID(contract);

    // // Update an asset which does not exist.
    // await updateNonExistentAsset(contract);
  } finally {
    gateway.close();
    client.close();
  }
}

/**
 * This type of transaction would typically only be run once by an application the first time it was started after its
 * initial deployment. A new version of the chaincode deployed later would likely not need to run an "init" function.
 */
async function initLedger(contract) {
  console.log(
    "\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger"
  );

  await contract.submitTransaction("initLedger");

  console.log("*** Transaction committed successfully");
}

/**
 * Evaluate a transaction to query ledger state.
 */
async function getAllAssets(contract) {
  console.log(
    "\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger"
  );

  const resultBytes = await contract.evaluateTransaction("GetAllAssets");

  const resultJson = utf8Decoder.decode(resultBytes);
  const result = JSON.parse(resultJson);
  console.log("*** Result:", result);
}

/**
 * Submit transaction asynchronously, allowing the application to process the smart contract response (e.g. update a UI)
 * while waiting for the commit notification.
 */
async function transferAssetAsync(contract) {
  console.log(
    "\n--> Async Submit Transaction: TransferAsset, updates existing asset owner"
  );

  const commit = await contract.submitAsync("TransferAsset", {
    arguments: [assetId, "Saptha"]
  });
  const oldOwner = utf8Decoder.decode(commit.getResult());

  console.log(
    `*** Successfully submitted transaction to transfer ownership from ${oldOwner} to Saptha`
  );
  console.log("*** Waiting for transaction commit");

  const status = await commit.getStatus();
  if (!status.successful) {
    throw new Error(
      `Transaction ${status.transactionId} failed to commit with status code ${status.code}`
    );
  }

  console.log("*** Transaction committed successfully");
}

async function readAssetByID(contract) {
  console.log(
    "\n--> Evaluate Transaction: ReadAsset, function returns asset attributes"
  );

  const resultBytes = await contract.evaluateTransaction("ReadAsset", assetId);

  const resultJson = utf8Decoder.decode(resultBytes);
  const result = JSON.parse(resultJson);
  console.log("*** Result:", result);
}

/**
 * submitTransaction() will throw an error containing details of any error responses from the smart contract.
 */
async function updateNonExistentAsset(contract) {
  console.log(
    "\n--> Submit Transaction: UpdateAsset asset70, asset70 does not exist and should return an error"
  );

  try {
    await contract.submitTransaction(
      "UpdateAsset",
      "asset70",
      "blue",
      "5",
      "Tomoko",
      "300"
    );
    console.log("******** FAILED to return an error");
  } catch (error) {
    console.log("*** Successfully caught the error: \n", error);
  }
}

/**
 * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
 */
function envOrDefault(key, defaultValue) {
  return process.env[key] || defaultValue;
}

/**
 * displayInputParameters() will print the global scope parameters used by the main driver routine.
 */
async function displayInputParameters() {
  console.log(`channelName:       ${channelName}`);
  console.log(`chaincodeName:     ${chaincodeName}`);
  console.log(`mspId:             ${mspId}`);
  console.log(`cryptoPath:        ${cryptoPath}`);
  console.log(`keyDirectoryPath:  ${keyDirectoryPath}`);
  console.log(`certPath:          ${certPath}`);
  console.log(`tlsCertPath:       ${tlsCertPath}`);
  console.log(`peerEndpoint:      ${peerEndpoint}`);
  console.log(`peerHostAlias:     ${peerHostAlias}`);
}

async function newGrpcConnection() {
  const tlsRootCert = await fs.readFile(tlsCertPath);
  const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
  return new grpc.Client(peerEndpoint, tlsCredentials, {
    "grpc.ssl_target_name_override": peerHostAlias
  });
}

async function newIdentity() {
  const credentials = await fs.readFile(certPath);
  return { mspId, credentials };
}

async function newSigner() {
  const files = await fs.readdir(keyDirectoryPath);
  const keyPath = path.resolve(keyDirectoryPath, files[0]);
  const privateKeyPem = await fs.readFile(keyPath);
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  return signers.newPrivateKeySigner(privateKey);
}

main();
