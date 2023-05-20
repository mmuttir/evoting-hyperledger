#!/bin/bash
export FABRIC_CFG_PATH=/var/hyperledger/config
cd $FABRIC_CFG_PATH
pwd
# Generate crypto material
cryptogen generate --config=$FABRIC_CFG_PATH/crypto-config.yaml --output=$FABRIC_CFG_PATH/crypto-config/

# Generate certificates and artifacts
configtxgen -profile EVotingGenesis -channelID evoting-sys-channel -outputBlock ./orderer/genesis.block
configtxgen -profile EVotingChannel -channelID evoting -outputCreateChannelTx ./evoting.tx
configtxgen -profile EVotingChannel -channelID evoting -outputAnchorPeersUpdate ./eventsanchors.tx -asOrg EventsMSP
configtxgen -profile EVotingChannel -channelID evoting -outputAnchorPeersUpdate ./promotionanchors.tx -asOrg PromotionMSP
configtxgen -profile EVotingChannel -channelID evoting -outputAnchorPeersUpdate ./registerationanchors.tx -asOrg RegisterationMSP
configtxgen -profile EVotingChannel -channelID evoting -outputAnchorPeersUpdate ./sportsanchors.tx -asOrg SportsMSP
configtxgen -profile EVotingChannel -channelID evoting -outputAnchorPeersUpdate ./sportsfemaleanchors.tx -asOrg SportsFemaleMSP
export FABRIC_CFG_PATH=/var/hyperledger/config/peer
export CORE_PEER_LOCALMSPID=EventsMSP
export CORE_PEER_ADDRESS="peer0.events.example.com:7051"
export CORE_PEER_MSPCONFIGPATH="/var/hyperledger/config/crypto-config/peerOrganizations/events.example.com/users/Admin@events.example.com/msp"
peer lifecycle chaincode package /opt/scripts/mychaincode.tar.gz --path /opt/nodechaincode --lang node --label vote_1.0.0
