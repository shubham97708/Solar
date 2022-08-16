const express = require('express');
const router = express.Router();
const pool = require('./pool');

const table = 'feedstock'
router.get('/IMEI', (req, res) => {
    res.render('search/IMEI');
})





router.get('/imeinoAndSoldDetailsAndTransferDetails/:imeino', (req, res) => {
    const {
        imeino
    } = req.params;


    const query1 = `select f.* ,(select modelno from model where id = f.modelid) as modelno , (select firmname from vendor where id = f.vendorid) as firmname from feedstock f  where  f.imeino = ?  ;`;
    const query2 = `select s.*, (select name from store where id = s.storeid) as storename from sold s where s.imeino = ?;`;
    const query3 = `select t.*, (select name from store where id = t. senderid) as sender, (select name from store where id = t. receiverid) as receiver from transfers t where imeino = ?;`
    pool.query(query1 + query2 + query3, [imeino, imeino, imeino], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json([]);
        } else {
            console.log(result)
            res.status(200).json(result);
        }
    })

})

module.exports = router;