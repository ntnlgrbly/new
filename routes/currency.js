const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async(req,res) => {
  // ETH , XRP , BTC , ILS , EUR , GBP
  let currenciesWanted_ar =  ["ETH","XRP","BTC","ILS","EUR","GBP"];
  let url = "https://freecurrencyapi.net/api/v2/latest?apikey=f2dce500-45f0-11ec-9860-7954a32a920b";
  let resp = await axios.get(url);


  // console.log(resp.data.data);
  // data.data -> הדאטא הראשון קשור לאקסיוס הדאטא השני
  // קשור לאיי פי איי
  let json_obj = resp.data.data
  // myObj.BTC -> myObj["BTC"]
  let myObj = {}
  // דואג לשלוף לתוך האובייקט שלי רק את 6 המאפייינים/מטבעות
  // שנמצאים במערך 
  currenciesWanted_ar.forEach(val => {
    myObj[val] = json_obj[val]
  })
  res.json(myObj)
})
// ראוט שמחזיר לי את המטבעות ביחס לשקל ולא לדולר
// http://localhost:3000/currency/ils
router.get("/ils", async(req,res) => {
  let currenciesWanted_ar =  ["ETH","XRP","BTC","EUR","GBP"];
  let url = "https://freecurrencyapi.net/api/v2/latest?apikey=f2dce500-45f0-11ec-9860-7954a32a920b";
  let resp = await axios.get(url);


  let json_obj = resp.data.data
  // מייצר מאפיין יו אס די ביחס לשקל
  let myObj = {USD:(json_obj.ILS).toFixed(2)}

  currenciesWanted_ar.forEach(val => {
    // כדי לחשב ערך של מטבע ביחס לשקל , מחלקים את ערך 
    // השקל לדולר בערך של המטבע לדולר
    myObj[val] =  (myObj.USD / json_obj[val]).toFixed(2)
  })
  // הביטקויין מגיע כאלפית אז אנחנו נותנים את הערך האמיתי
  myObj.BTC = (myObj.BTC*1000).toFixed(2);

  res.json(myObj)
})


// לפי מטבע שניתן נותן את המטבעות כמה הם שווים ביחס אליו
router.get("/byCoin/:idCoin", async(req,res) => {
  let idCoins = req.params.idCoin
  // אני יוכל לקחת כל איי די של מטבע ולראות מה הערך שלו ביחס ל6 מטבעות
  // הבאים: ["ETH","XRP","BTC","EUR","GBP","ILS"];
  // localhost:3000/currency/byCoin/GBP
  let currenciesWanted_ar =  ["ETH","XRP","BTC","EUR","GBP","ILS"];
  let url = "https://freecurrencyapi.net/api/v2/latest?apikey=f2dce500-45f0-11ec-9860-7954a32a920b";
  let resp = await axios.get(url);


  let json_obj = resp.data.data

  let myObj = {}

  currenciesWanted_ar.forEach(val => {

    myObj[val] =  (json_obj[idCoins] / json_obj[val]).toFixed(2)
  })
  // הביטקויין מגיע כאלפית אז אנחנו נותנים את הערך האמיתי
  myObj.BTC = (myObj.BTC*1000).toFixed(2);

  res.json(myObj)
})

module.exports = router;