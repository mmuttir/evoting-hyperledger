#Docker file for setting up the budget peer

FROM hyperledger/fabric-peer

LABEL  maintainer="Muhammad Mutti Ur Rehman <mutti.rehman1122@gmail.com>"

#1. Create the config subfolder
RUN mkdir -p /var/hyperledger/config

#2. Copy the crypto for peer crypto
COPY ./config/crypto-config/peerOrganizations/promotion.example.com/users/Admin@promotion.example.com/msp /var/hyperledger/msp

#3. Copy the anchor peer update tx
COPY ./config/promotionanchors.tx /var/hyperledger/config/promotionanchors.tx

#5. Copy the genesis file
COPY ./config/evoting.tx  /var/hyperledger/config/evoting.tx

#6. Copy the orderer YAML
COPY ./config/peer/core.yaml /var/hyperledger/config/core.yaml

#8. Copy the test chaincode
COPY ./chaincode  /opt/nodechaincode

#11. Install the jq package - used in scripts
RUN apt update \
 && apt install -y jq \
 && rm -rf /var/cache/apt/*


#12. Create the package folder
RUN mkdir -p /var/hyperledger/packages

#14. Launch the peer
CMD peer node start
