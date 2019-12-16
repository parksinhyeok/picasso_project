var myConnection = require('../dbConfig');

class itemModel {

    //DB에 넣을 Artist Data의 Data 삽입
    setArtist(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'INSERT INTO artist (artistName, artistRef, artistBirth, artistIntro) values (? ,? ,? ,?)';
                    myConnection.query(sql, [data.artistName, data.artistBirth, data.artistRef, data.artistIntro]);
                    resolve(true);
                } catch (err) {
                    console.log('setArtist Err', err)
                    reject(err);
                }
            }
        )
    }

    //DB에 넣을 Image Data의 Base64 Data 삽입
    setItem(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    console.log(data)
                    var sql = 'INSERT INTO artwork (image) values (?)';
                    await myConnection.query(sql, [data.itemImage]);
                    resolve(true);
                } catch (err) {
                    console.log('Set Item Err', err);
                    reject(err);
                }
            }
        )
    }

    //Block Chain 에 넣을 Artist Data의 args 생성
    getItemCode() {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT MAX(id) AS itemCode FROM artwork';
                    var result = await myConnection.query(sql);
                    console.log(result[0][0].itemCode)
                    var returnValue = result[0][0].itemCode
                    resolve(returnValue);
                } catch (err) {
                    console.log('Get Artist Code Err', err);
                    reject(err);
                }
            }
        )
    }

    getArtistCode() {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT MAX(id) AS artistCode FROM artist';
                    var result = await myConnection.query(sql);
                    console.log(result[0][0].artistCode)
                    var returnValue = result[0][0].artistCode
                    resolve(returnValue);
                } catch (err) {
                    console.log('Get Artist Code Err', err);
                    reject(err);
                }
            }
        )
    }

}

module.exports = new itemModel();