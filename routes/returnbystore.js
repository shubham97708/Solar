const router = require('express').Router();
const pool = require('./pool');
const json2xls = require('json2xls');
const express = require('express');
router.use(json2xls.middleware);



router.get('/returnvendor', (req, res) => {
    console.log("id   hjjjjjjjjjjjjjjjjjjjjjjjjjjj    ", req.query.id)
    res.render('returnvendor/returnvendor', {
        st_id: req.query.id,datas:''
    });
})




router.post("/productReturn", (req, res) => {
    console.log(req.body);
    var counts =0
    global.count=0;
    global.message;
    global.stid = req.body.st_id;
  

    const status = "True"     
    pool.query(`Select * from billproduct where invoiceno = ? and status = 'True' `, [req.body.invoiceno], (err, result1) => {
    //const auth = `select * from billproduct where invoiceno = ? and status = ?`;
   
   // pool.query(auth, [req.body.invoiceno,"True"], (err, result1) => {

        if (err) {
            console.log(err);
            res.status(500).json(false);
        } else if (result1.length == 0) {
            console.log("Data BU hhhhhh ",result1 )
            res.status(200).json("not found");
        } else if (result1.length > 0) {

            console.log("Data BU ggggg ",result1 )
            global.len = result1.length;
           // global.imeilen = result1.imeimob.length
          //  console.log(global.len,"          ",global.imeilen)
            pool.query(`update bill set status='False' where id = ${req.body.invoiceno}  ;update billproduct set status='False' where invoiceno = ${req.body.invoiceno}`, (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Entry")
                    const bigQuery = `
update feedstock set selled = 'false', storeid = ?, storename = (select name from store where id = ?) where imeino = ?;
insert into returns(storeid, imeino, date, reason) values (?, ?, now(), ?);
update sold set status = 'history' where imeino = ? and storeid = ?`;

                    if (global.len > 1) {
                        
                        for (var i = 0; i < global.len; i++) {
                            console.log("imei          ooooooooooooooo", result1[i].imeimob)
                           
pool.query(bigQuery, [
           global.stid, global.stid, result1[i].imeimob,
           global.stid, result1[i].imeimob, req.body.reason, 
           result1[i].imeimob, global.stid], (err, result) => {
               console.log("Entry in loop")
                                if (err) {
                                    console.log(err);
                                    global.message="Not Return Succesfully"
                                    if((global.len-1)==count){
                                        res.render('returnvendor/returnvendor',{datas:'Returned failed',st_id:global.stid
                                    })
                                    }
                            
                                } else {
                                    global.message="Returned Succesfully"
                                    console.log("multiple product")
                                    console.log("check      kkkkkkkkkkkkkkkkk",global.len-1,"kkkkkkkkk",counts)
                                    if((global.len-1)==counts){
                                        res.render('returnvendor/returnvendor',{datas:'Returned Successfully',st_id:global.stid
                                    })
                                    }
                                    counts=counts+1;
                                }
                            });
                        }
                        
                    } else {
                       pool.query(bigQuery, [global.stid, global.stid, result1[0].imeimob, global.stid, result1[0].imeimob, req.body.reason, result1[0].imeimob, global.stid], (err, result) => {
                            if (err) {
                                console.log(err);
                                global.message='Returned Failed'
                                res.render('returnvendor/returnvendor',{datas:global.message,st_id:global.stid})
                                
                            } else {
                                console.log("Single product")
                                global.message='Returned Successfully'
                                res.render('returnvendor/returnvendor',{datas:global.message,st_id:global.stid})
                            }
                        });
                    }
                }
            });
        }
    })

})
module.exports = router;