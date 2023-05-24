# Updated to Fabric 2.x
#1. Docker file for setting up the Orderer
FROM hyperledger/fabric-orderer

LABEL maintainer="Muhammad Mutti Ur Rehman <mutti.rehman1122@gmail.com>"

#2. Create the folder for configurations
RUN mkdir -p /var/hyperledger/config

#3. Copy the crypto for orderer
COPY ./config/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp /var/hyperledger/msp
COPY ./config/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls /var/hyperledger/tls

#4. Copy the orderer configuration
COPY ./config/orderer /var/hyperledger/config

#5. Launch the Orderer
CMD orderer

