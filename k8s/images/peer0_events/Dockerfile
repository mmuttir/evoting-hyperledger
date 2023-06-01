#Docker file for setting up the budget peer

FROM hyperledger/fabric-peer

LABEL  maintainer="Muhammad Mutti Ur Rehman <mutti.rehman1122@gmail.com>"

#1. Create the config subfolder
RUN mkdir -p /var/hyperledger/config

#2. Copy the crypto for peer crypto
COPY ./config/crypto-config/peerOrganizations/events.example.com/users/Admin@events.example.com/msp /var/hyperledger/msp

#3. Copy the anchor peer update tx
COPY ./config/eventsanchors.tx /var/hyperledger/config/eventsanchors.tx

#5. Copy the genesis file
COPY ./config/evoting.tx  /var/hyperledger/config/evoting.tx

#6. Copy the orderer YAML
COPY ./config/peer/core.yaml /var/hyperledger/config/core.yaml

#8. Copy the test chaincode
COPY ./chaincode  /opt/nodechaincode

#9. Copy the API
COPY ./api  /opt/api

#10. Install node and npm
RUN apt update && apt install nodejs npm -y

#11. Install the API dependencies
RUN cd /opt/api && npm install


#12. Create the package folder
RUN mkdir -p /var/hyperledger/packages

#13. Launch the peer
CMD peer node start
