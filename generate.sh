#!/bin/bash

# Install required tools (cryptogen and configtxgen)
apt-get update
apt-get -y install curl
curl -sSL https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/bootstrap.sh | bash -s -- 2.3.3 1.5.0

# Generate certificates and artifacts
./bin/
export FABRIC_CFG_PATH=$PWD
./bin/configtxgen -profile EVotingOrdererGenesis -channelID evoting-sys-channel -outputBlock ./genesis.block
configtxgen -profile EVotingChannel -channelID evoting -outputCreateChannelTx ./evoting.tx
configtxgen -profile EVotingChannel -channelID evoting -outputAnchorPeersUpdate ./eventsanchors.tx -asOrg Events
configtxgen -profile EVotingChannel -channelID evoting -outputAnchorPeersUpdate ./promotionanchors.tx -asOrg Promotion
configtxgen -profile EVotingChannel -channelID evoting -outputAnchorPeersUpdate ./registerationanchors.tx -asOrg Registeration
configtxgen -profile EVotingChannel -channelID evoting -outputAnchorPeersUpdate ./sportsanchors.tx -asOrg Sports
configtxgen -profile EVotingChannel -channelID evoting -outputAnchorPeersUpdate ./sports_femaleanchors.tx -asOrg Sports_female
