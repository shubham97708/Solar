const express = require('express');
const router = express.Router();
const pool = require('./pool');
const json2xls = require('json2xls');

router.use(json2xls.middleware);


router.get('/excel-sheet', (req, res) => {
    const query = 'SELECT storename, (select name from model where feedstock.modelid = id) as model, count(id) as units, color FROM feedstock where storeid != 0 group by  model, storename, color order by storename, model';
    pool.query(query, (err, result) => {
        if (err) {
            res.json(err);
        } else {

            res.xls(`Available Stock - ${(new Date()).toLocaleDateString()}.xlsx`, result);
        }
    })
})

router.get('/excel-sheet-store', (req, res) => {
    const query = 'SELECT * from store';
    pool.query(query, (err, result) => {
        if (err) {
            res.json(err);
        } else {

            res.xls(`Available Store - ${(new Date()).toLocaleDateString()}.xlsx`, result);
        }
    })
})
router.get('/excel-sheet-brand', (req, res) => {
    const query = 'SELECT id,name,(select name from categories where categories.id = brand.categoryid) as categoryname,gadget,discount,point FROM brand order by id';
    pool.query(query, (err, result) => {
        if (err) {
            res.json(err);
        } else {
        //    console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",result)
            res.xls(`Available Brands - ${(new Date()).toLocaleDateString()}.xlsx`, result);
        }
    })
})
router.get('/excel-sheet-model', (req, res) => {
    const query = 'SELECT id,name,modelno,(select name from brand where brand.id = model.brandid) as brandname FROM model order by id,brandname';
    pool.query(query, (err, result) => {
        if (err) {
            res.json(err);
        } else {
        //    console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",result)
            res.xls(`Available Models - ${(new Date()).toLocaleDateString()}.xlsx`, result);
        }
    })
})

router.get('/excel-searchByDate/:date1/:date2', (req, res) => {
    const {
        date1,
        date2
    } = req.params;
    const query = `select t.id, t.person, t.senderid, t.receiverid, t.imeino, (select modelno from model where id = (select modelid from feedstock where imeino = t.imeino)) as modelno, (select name from store where id = t.senderid ) as sender, (select name from store where id = t.receiverid ) as receiver, t.date from transfers t where date between ? and ?  order by date desc`;
    pool.query(query, [date1, date2], (err, result) => {
        if (err) {
            console.log(err);
            res.json(err);
        } else {
            res.xls(`TransferListCopyByAppliedSearchByDateFilter- ${(new Date()).toLocaleDateString()}.xlsx`, result);
        }
    })
});



module.exports = router;