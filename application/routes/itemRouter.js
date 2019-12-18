var express = require('express');
var itemRouter = express.Router();

var itemModel = require('../model/itemModel');
var ccModel = require('../model/ccModel');

//Item DB 및 BlockChain 저장
itemRouter.post('/api/setitem', async (req, res) => {
    try {
        console.log(req.body.ItemCertificate);
        //Browser-> Server 전달받은 Data 분류
        artist = {
            artistName: req.body.artistName,
            // artistBirth: req.body.ArtistBirth,
            // artistRef: req.body.ArtistRef,
            artistIntro: req.body.ArtistIntro,
        }
        item = {
            itemImage: req.body.ItemImage,
            itemCertificate: req.body.ItemCertificate,
            itemName: req.body.ItemName,
            itemDetails: req.body.ItemDetails,
        }

        //DB에 Artist 및 Item 정보 Put
        await itemModel.setArtist(artist);
        await itemModel.setItem(item);

        //Hashing Function Here

        

        //BlockChain의 Args Call
        artistCode = await itemModel.getArtistCode();
        itemCode = await itemModel.getItemCode();

        //itemImageHash에 Image Hashing한 Data 삽입
        bdata = {
            itemCode: JSON.stringify(itemCode),
            artistCode: JSON.stringify(artistCode),
            itemCertificate: item.itemCertificate,
            itemImageHash: item.itemImage,
            itemName: item.itemName,
        }
        await ccModel.addArtwork(bdata);

        //INSERTing Wallet Addr Func Here
        

        res.status(200).end();
    } catch (err) {
        console.log('Setitem Err :', err);
        console.log(err);
    }
});

//Browser-> Server Item list 조회
itemRouter.get('/api/item', async (req, res) => {
    try {
        var responseData = [];
        var history = await ccModel.getHistory();
        var data = JSON.parse(history);

        for(var i = 0; i < data.length; i++) {
            var jsonMaker = new Object();
            

            var artistData = await itemModel.getAllArtist(data[i].artistcode);

            jsonMaker.itemCode = data[i].itemcode;

            var item = {itemName : data[i].itemname, itemImage: data[i].itemimagehash, artistName : artistData.artistName};

            jsonMaker.item = item;

            responseData.push(jsonMaker);
        }
        console.log(JSON.stringify(responseData));

        res.status(200).send(responseData)
    } catch (err) {
        console.log('item Err :', err);
        console.log(err);
    }
});

//Browser-> Server Item Details 조회
itemRouter.post('/api/item/:itemCode', async (req, res) => {
    try {
        console.log('get by id', req.params);
        var data = await ccModel.getArtwork(req.params);
        res.status(200).send(data);
    } catch (err) {
        console.log('Item Details Err :', err);
        console.log(err);
    }
});

module.exports = itemRouter;