docker exec cli peer chaincode install -n cargo -v 1.1 -p github.com/artwork/
docker exec cli peer chaincode upgrade -v 1.1 -C trucker -n cargo -c '{"Args":["Init"]}' -P 'OR ("Org1MSP.member", "Org2MSP.member")'

docker exec cli peer chaincode invoke -o orderer.trucker.com:7050 -C trucker -n cargo -c '{"Args":["addArtwork","3","asd","egerg","fefwf","wefwds","wefwdf"]}'
docker exec cli peer chaincode query -C trucker -n cargo -c '{"Args":["getArtwork","1"]}'
docker exec cli peer chaincode query -C trucker -n cargo -c '{"Args":["getHistory"]}'
