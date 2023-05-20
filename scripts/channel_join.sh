#!/bin/bash

cd /var/hyperledger/config
# Parse command line arguments
if [ $# -lt 1 ]; then
    echo "Usage: $0 <channel_name> [-c|--create <bool>] [-u|--update <bool>]"
    exit 1
fi
channel_name_cap="$1"
channel_name=$(echo "$channel_name_cap" | tr '[:upper:]' '[:lower:]')

# NOTE: This is a hack to get the correct MSP ID for the channel
# channel_name_cap=SportsFemale
# Set environment variables
export FABRIC_CFG_PATH=/var/hyperledger/config/peer
export CORE_PEER_LOCALMSPID="${channel_name_cap}MSP"
export CORE_PEER_ADDRESS="peer0.$channel_name.example.com:7051"
export CORE_PEER_MSPCONFIGPATH="/var/hyperledger/config/crypto-config/peerOrganizations/$channel_name.example.com/users/Admin@$channel_name.example.com/msp"
# Set default values for boolean inputs
channel_create=false
channel_update=false
# peer channel fetch 0 evoting.block -o orderer.example.com:7050 -c evoting

# Parse command line arguments
while [[ $# -gt 1 ]]
do
key="$2"

case $key in
    -c|--create)
    channel_create=true
    shift
    ;;
    -u|--update)
    channel_update=true
    shift
    ;;
    *)
    echo "Unknown option: $key"
    exit 1
    ;;
esac
done

# Check if either channel create or channel update commands should be executed
if [[ $channel_create == true ]]
then
    # Execute peer channel create command
    peer channel create -o orderer.example.com:7050 -f "./evoting.tx" -c evoting
    
fi
peer channel join -o orderer.example.com:7050 -b "./evoting.block"
if [[ $channel_update == true ]]
then
    # Execute peer channel update command
    peer channel update -o orderer.example.com:7050 -f "./${channel_name}anchors.tx" -c evoting
fi

export CORE_PEER_ADDRESS="peer1.$channel_name.example.com:7051"
export CORE_PEER_MSPCONFIGPATH="/var/hyperledger/config/crypto-config/peerOrganizations/$channel_name.example.com/users/User1@$channel_name.example.com/msp"
peer channel join -o orderer.example.com:7050 -b "./evoting.block"