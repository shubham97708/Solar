const json2xls = require('json2xls');
const express = require('express');
const router = express.Router();
const pool = require('./pool');

router.use(json2xls.middleware);

router.all('*', (req, res, next) => {
    if (req.session.adminId)
        next()
    else
        res.redirect('/admin')
});

router.get('/', (req, res) => {
    res.render('dailyreport/index');
});

//SINGLE DATE1 TRANSFER
router.get('/transfer/:date', (req, res) => {
    const {
        date
    } = req.params;
    const query = `select t.id, t.person, t.imeino, (select modelno from model where id = (select modelid from feedstock where imeino = t.imeino)) as modelno, (select name from store where id = t.senderid ) as sender, (select name from store where id = t.receiverid ) as receiver, t.date from transfers t where t.date = ?`;
    pool.query(query, [date], (err, result) => {
        if (err) {
            console.log(err);
            res.send('Error Occurred');
        } else {
            res.xls(`${(new Date()).toLocaleDateString()} - transfer report.xlsx`, result);
        }
    })
});



//BETWEEN Two Dates DATE 1 and DATE 2 TRANSFER
router.get('/transfer/:date/:date', (req, res) => {
    const {
        date1,
        date2
    } = req.params;
    const query = `select t.id, t.person, t.imeino, (select modelno from model where id = (select modelid from feedstock where imeino = t.imeino)) as modelno, (select name from store where id = t.senderid ) as sender, (select name from store where id = t.receiverid ) as receiver, t.date from transfers t where t.date = ?`;
    pool.query(query, [date1, date2], (err, result) => {
        if (err) {
            console.log(err);
            res.send('Error Occurred');
        } else {
            res.xls(`${(new Date()).toLocaleDateString()} - transfer report.xlsx`, result);
        }
    })
});





//SINGLE DATE1 SOLD
router.get('/sold/:date', (req, res) => {
    const {
        date
    } = req.params;
    const query = `select t.id, t.storeid, t.imeino, (select modelno from model where id = (select modelid from feedstock where imeino = t.imeino)) as modelno, (select name from store where id = t.storeid ) as store, t.date from sold t where t.date = ?`;
    pool.query(query, [date], (err, result) => {
        if (err) {
            console.log(err);
            res.send('Error Occurred');
        } else {
            res.xls(`${(new Date()).toLocaleDateString()} - Sold report.xlsx`, result);
        }
    })
});

//Bwtween Two Dates DATE1 to DATE2 SOLD
router.get('/sold/:date1/:date2', (req, res) => {
    const {
        date1,
        date2
    } = req.params;

    const query = `select t.id, t.storeid, t.imeino, (select modelno from model where id = (select modelid from feedstock where imeino = t.imeino)) as modelno, (select name from store where id = t.storeid ) as store, t.date from sold t where date between ? and ?  order by date desc`;
    pool.query(query, [date1, date2], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json([]);
        } else {
            res.xls(`Sold Stock - ${(new Date()).toLocaleDateString()}.xlsx`, result);
            // res.xls(`Sold Stock - ${(new Date()).toLocaleDateString()}.xlsx`, result);

            //  console.log(result.length)
        }
    })

});





module.exports = router;