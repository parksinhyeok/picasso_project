#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

function checkPrereqs() {
    # check config dir
    if [! -d "crypto-config"]; then
        echo "crypto-config dir missing"
        exit 1
    fi

    # check crypto-config dir
    if [! -d "config"]; then
        echo "config dir missing"
        exit 1
    fi
}

function replacePrivateKey() {
    echo "ca key file exchange"
    PRIV_KEY=$(ls crypto-config/peerOrganizations/artist.example.com/ca/ | grep _sk)
    sed -i "s/CA_PRIVATE_KEY/${PRIV_KEY}/g" docker-compose.yml
}

checkPrereqs
replacePrivateKey

# Exit on first error, print all commands.
set -ev

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

docker-compose -f docker-compose.yml down

docker-compose -f docker-compose.yml up -d ca.example.com orderer.example.com peer0.artist.example.com peer0.company.example.com peer0.client.example.com couchdb1 couchdb2 couchdb3 cli
docker ps -a

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
export FABRIC_START_TIMEOUT=10
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}

# Create the channel
# -e: 환경 변수 지정
# docker exec -e "CORE_PEER_LOCALMSPID=ArtistMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@artist.example.com/msp" peer0.artist.example.com peer channel create -o orderer.example.com:7050 -c mychannel -f /etc/hyperledger/configtx/channel.tx

# Create the channel
docker exec cli peer channel create -o orderer.example.com:7050 -c mychannel -f /etc/hyperledger/configtx/channel.tx

# Join peer0.artist.example.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=ArtistMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@artist.example.com/msp" peer0.artist.example.com peer channel join -b /etc/hyperledger/configtx/mychannel.block
sleep 5

# Join peer0.company.example.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=CompanyMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@company.example.com/msp" peer0.company.example.com peer channel join -b /etc/hyperledger/configtx/mychannel.block
sleep 5

# Join peer0.client.example.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=ClientMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@client.example.com/msp" peer0.client.example.com peer channel join -b /etc/hyperledger/configtx/mychannel.block
sleep 5