var express = require('express');
var itemRouter = express.Router();

var itemModel = require('../model/itemModel');
var ccModel = require('../model/ccModel');

itemRouter.post('/api/setitem', async (req, res) => {
    try {
        console.log(req.body);
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

        await itemModel.setArtist(artist);
        await itemModel.setItem(item);
        //Put Hashing Function Here

        


        artistCode = await itemModel.getArtistCode();
        itemCode = await itemModel.getItemCode();

        console.log('artistCode : ', artistCode);
        console.log('itemCode : ', itemCode);

        //itemImageHash에 Image Hashing한 Data 삽입
        bdata = {
            itemCode: JSON.stringify(itemCode),
            artistCode: JSON.stringify(artistCode),
            itemCertificate: item.itemCertificate,
            itemImageHash: item.itemImage,
            itemName: item.itemName,
        }
        await ccModel.addArtwork(bdata);
        res.status(200).end();
    } catch (err) {
        console.log(err);
    }
});

itemRouter.get('/api/item', async (req, res) => {
    try {
        var data = await ccModel.getHistory();
        res.status(200).send(data)
    } catch (err) {
        console.log(err);
    }
});

itemRouter.post('/api/item/:id', async (req, res) => {
    try {
        console.log(req.body);
        var data = await ccModel.getArtData(req.body);
        res.status(200).send(data);
    } catch (err) {
        console.log(err);
    }
});

module.exports = itemRouter;