const express = require('express');
const router = express.Router();
const pool = require('./pool');
const json2xls = require('json2xls');

router.use(json2xls.middleware);

const table = 'sold'


  router.get('*', (req, res, next) => {
    if (req.session.adminId){
        next()

    }
   
else{
    res.redirect('/admin') 
}

}) 

router.get('/', (req, res) => {
    res.render('sold/all');
});

router.get('/all', (req, res) => {
    const query = `select t.id, t.storeid, t.imeino, (select modelno from model where id = (select modelid from feedstock where imeino = t.imeino)) as modelno, (select name from store where id = t.storeid ) as store, t.date from sold t order by date desc LIMIT 30`;
    pool.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json([]);
        } else {
            res.status(200).json(result);
            // res.download(result)
            //res.xls(`Sold Stock - ${(new Date()).toLocaleDateString()}.xlsx`, result);
            //res.xls(`Sold Stock - ${(new Date()).toLocaleDateString()}.xlsx`, result);

        }
    })
});



router.get('/prevbillshow/:id', (req, res) => {

    const {
        id
    } = req.params;

    pool.query(`select * from bill where id = ?`, [req.params.id], (error, result) => {
        if (error) {
            console.log(error)
        } else {
            console.log("Data From subs  ",result)

            pool.query(`select * from billproduct where invoiceno=?`, [req.params.id], (cerror, cresult) => {

                if (error) {
                    console.log(error)
                } else {
                    console.log("Bill => ", result, " Billproduct => ", cresult, "   ***   ")
                     res.render("storelogin/prevbillprint", {
                        data: cresult,
                        body: result[0],
                        customer: result,
                        scheme: result,
                        invoice: parseInt(req.params.id),
                        prevpoint: parseInt(result[0].pbonuspoint)
                    }) 
                    //res.render("storelogin/billprint",{data:rschemee,body:req.body,customer:ctable,scheme:rscheme,invoice:parseInt(result.insertId),prevpoint:0})

                    //res.render("Bill => ",result," Billproduct => ",cresult)
                }
            })

        }
    })
});












// Show EDit Form For Bill 
router.get('/editbillbilproduct/:id', (req, res) => {

    const {
        id
    } = req.params;

    pool.query(`select * from bill where id = ?`, [req.params.id], (error, result) => {
        if (error) {
            console.log(error)
        } else {
            console.log("Data From subs  ",result)

            pool.query(`select * from billproduct where invoiceno=?`, [req.params.id], (cerror, cresult) => {

                if (error) {
                    console.log(error)
                } else {
                    console.log("Bill => ", result, " Billproduct => ", cresult, "   ***   ")
                     res.render("storelogin/editbillbilproduct", {
                        bill: result,
                        billproduct: cresult,
                    }) 
                    //res.render("storelogin/billprint",{data:rschemee,body:req.body,customer:ctable,scheme:rscheme,invoice:parseInt(result.insertId),prevpoint:0})

                    //res.render("Bill => ",result," Billproduct => ",cresult)
                }
            })

        }
    })
});


// For Edit Bill
router.post('/editbillbyid', (req, res) => {
console.log("Edit Bill by Id",req.body)
const query = `update bill set cname = ?, cmobile = ? ,ccard = ? ,paytype = ? , fcname = ? , downpayment = ?, financeamount = ? where id = ?;`;
  pool.query(query, [req.body.cname,req.body.cmobile, req.body.ccard , req.body.paytype, req.body.fcname ,req.body.downpayment ,req.body.financeamount , req.body.billid], (err, result) => {
    if(err){
        console.log(err)
    }else{
        res.send(`Succefully Editted Invoice No = ${req.body.billid} `)
    }
  })
})


// For Edit BillProduct
router.post('/editbillproductbyid', (req, res) => {
    const query = `update billproduct  set ptype = ? , brandname = ? , modelname = ? , modelno = ? , color = ? , price = ? , imeimob = ?  where id = ?;`;
  pool.query(query, [ req.body.ptype , req.body.brandname , req.body.modelname, req.body.modelno, req.body.color ,req.body.price, req.body.imeimob, req.body.productid], (err, result) => {
    if(err){
        console.log(err)
    }else{
        res.send(`Succefully Editted  = ${req.body.brandname}  - ${req.body.modelname} `)
    }
  })  
})





router.get('/searchByDate/:date1/:date2', (req, res) => {
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

            // res.xls(`Sold Stock - ${(new Date()).toLocaleDateString()}.xlsx`, result);
            res.status(200).json(result);
        }
    })
});

router.get('/store/:id', (req, res) => {
    const {
        id
    } = req.params;
    const query = `select t.id, t.storeid, t.imeino, (select modelno from model where id = (select modelid from feedstock where imeino = t.imeino)) as modelno, (select name from store where id = t.storeid ) as store, t.date from sold t where storeid = ?  order by date desc`;
    var sql = pool.query(query, [id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json([]);
        } else {
            res.status(200).json(result);
            // res.xls(`Sold Stock - ${(new Date()).toLocaleDateString()}.xlsx`, result);
        }
    })
    console.log(sql);

});


router.get('/onDate/:date', (req, res) => {
    const {
        date
    } = req.params;
    const query = `select t.id, t.storeid, t.imeino, (select modelno from model where id = (select modelid from feedstock where imeino = t.imeino)) as modelno, (select name from store where id = t.storeid ) as store, t.date from sold t where t.date = ?`;
    var sql = pool.query(query, [date], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json([]);
        } else {
            res.status(200).json(result);
        }
    })
    console.log(sql);

});

module.exports = router;