var express = require('express');
var itemRouter = express.Router();

var itemModel = require('../model/itemModel');
var ccModel = require('../model/ccModel');

//Item DB 및 BlockChain 저장
itemRouter.post('/api/setitem', async (req, res) => {
    try {
        //Browser-> Server 전달받은 Data 분류
        artist = {
            artistName: req.body.ArtistName,
            artistBirth: req.body.ArtistBirth,
            artistRef: req.body.ArtistRef,
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

        //DB에 Wallet Addr 삽입
        

        res.status(200).end();
    } catch (err) {
        console.log('Setitem Err :', err);
        console.log(err);
    }
});

//Browser-> Server Item list 조회
itemRouter.get('/api/item', async (req, res) => {
    try {
        var data = await ccModel.getHistory();
        res.status(200).send(data)
    } catch (err) {
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
        console.log(err);
    }
});

module.exports = itemRouter;