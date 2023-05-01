export FABRIC_CFG_PATH=$PWD
cryptogen generate --config=./crypto-config.yaml
configtxgen -profile EVotingGenesis -channelID evoting-sys-channel -outputBlock ./channel_artefacts/genesis.block
configtxgen -profile EVotingChannel -channelID evoting -outputAnchorPeersUpdate ./channel_artefacts/eventsanchors.tx -asOrg EventsMSP
configtxgen -profile EVotingChannel -channelID evoting -outputAnchorPeersUpdate ./channel_artefacts/promotionanchors.tx -asOrg PromotionMSP
configtxgen -profile EVotingChannel -channelID evoting -outputAnchorPeersUpdate ./channel_artefacts/registerationanchors.tx -asOrg RegisterationMSP
configtxgen -profile EVotingChannel -channelID evoting -outputAnchorPeersUpdate ./channel_artefacts/sportsanchors.tx -asOrg SportsMSP
configtxgen -profile EVotingChannel -channelID evoting -outputAnchorPeersUpdate ./channel_artefacts/sports_femaleanchors.tx -asOrg SportsFemaleMSP