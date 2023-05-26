#!/bin/bash

cd /var/hyperledger/config
# Parse command line arguments
if [ $# -lt 1 ]; then
    echo "Usage: $0 <channel_name> [-c|--create <bool>] [-u|--update <bool>]"
    exit 1
fi
channel_name_cap="$1"
channel_name=$(echo "$channel_name_cap" | tr '[:upper:]' '[:lower:]')
# Set environment variables
export FABRIC_CFG_PATH=/var/hyperledger/config/peer
export CORE_PEER_LOCALMSPID="${channel_name_cap}MSP"
export CORE_PEER_ADDRESS="peer0.$channel_name.example.com:7051"
export CORE_PEER_MSPCONFIGPATH="/var/hyperledger/config/crypto-config/peerOrganizations/$channel_name.example.com/users/Admin@$channel_name.example.com/msp"
peer lifecycle chaincode install mychaincode.tar.gz
peer lifecycle chaincode approveformyorg --channelID evoting --name mychaincode --version 1.0 --init-required --package-id vote_1.0.0:c960d493bd6308e5ebeccf9d9d662f19f124bb77ef4633c99f296397031b458f --sequence 1 --waitForEvent
peer lifecycle chaincode commit -o $ORDERER_ADDRESS --channelID evoting --name mychaincode --version 1.0 --sequence 1 --init-required --waitForEvent
# peer chaincode invoke -o orderer.example.com:7050 --channelID evoting --name mychaincode --peerAddresses peer0.$channel_name.example.com:7051 --isInit -c '{"Args":["initLedger"]}' --waitForEvent

export FABRIC_CFG_PATH=/var/hyperledger/config/peer
export CORE_PEER_LOCALMSPID="${channel_name_cap}MSP"
export CORE_PEER_ADDRESS="peer1.$channel_name.example.com:7051"
export CORE_PEER_MSPCONFIGPATH="/var/hyperledger/config/crypto-config/peerOrganizations/$channel_name.example.com/users/User1@$channel_name.example.com/msp"
# NOTE: Uncomment it to package chaincode
peer lifecycle chaincode package mychaincode.tar.gz --path /opt/nodechaincode --lang node --label vote_1.0.0
peer lifecycle chaincode install mychaincode.tar.gz
peer lifecycle chaincode queryinstalled
# peer lifecycle chaincode approveformyorg --channelID evoting --name mychaincode --version 1.0 --init-required --package-id vote_1.0.0:0fffb058718e0f114b1907d3c84c3e9e2ea8e7d7f6630e21aaa67c4c8a66e676 --sequence 1 --waitForEvent
peer lifecycle chaincode commit -o orderer.example.com:7050 --channelID evoting --name mychaincode --version 1.0 --sequence 1 --init-required --peerAddresses peer1.$channel_name.example.com:7051 --waitForEvent
# peer chaincode invoke -o orderer.example.com:7050 --channelID evoting --name mychaincode --peerAddresses peer1.$channel_name.example.com:7051 --isInit -c '{"Args":["castVote", "Mutti", "Usama"]}' --waitForEvent