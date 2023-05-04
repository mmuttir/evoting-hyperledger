#!/bin/bash


# Generate certificates and artifacts

export FABRIC_CFG_PATH=/fabric/
configtxgen -profile EVotingGenesis -channelID evoting-sys-channel -outputBlock /fabric/channel-artifacts/genesis.block
configtxgen -profile EVotingChannel -channelID evoting -outputCreateChannelTx /fabric/channel-artifacts/evoting.tx
configtxgen -profile EVotingChannel -channelID evoting -outputAnchorPeersUpdate /fabric/channel-artifacts/eventsanchors.tx -asOrg EventsMSP
configtxgen -profile EVotingChannel -channelID evoting -outputAnchorPeersUpdate /fabric/channel-artifacts/promotionanchors.tx -asOrg PromotionMSP
configtxgen -profile EVotingChannel -channelID evoting -outputAnchorPeersUpdate /fabric/channel-artifacts/registerationanchors.tx -asOrg RegisterationMSP
configtxgen -profile EVotingChannel -channelID evoting -outputAnchorPeersUpdate /fabric/channel-artifacts/sportsanchors.tx -asOrg SportsMSP
configtxgen -profile EVotingChannel -channelID evoting -outputAnchorPeersUpdate /fabric/channel-artifacts/sports_femaleanchors.tx -asOrg SportsFemaleMSP
