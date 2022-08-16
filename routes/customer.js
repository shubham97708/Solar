const router = require('express').Router();
const pool = require('./pool');
const json2xls = require('json2xls');
const express = require('express');
router.use(json2xls.middleware);

// Show Total Bill Of perticular customer
router.get('/custotalbill/:mbl', (req, res) => {
  const {
    mbl
  } = req.params;
  console.log(req.params.id)
  if (req.session.adminId) {
    pool.query(`Select * from bill  where cmobile = ?`, req.params.mbl, (err, result) => {
      console.log(result)
      //res.render("customer/customeradmin",{data:result})
      res.render("customer/customertotalbill", {
        data: result
      })
    })

  } else {
    res.send('Invalid')
  }
})


// Show Bill Product for perticular customer
router.get('/custotalbillproduct/:invoice', (req, res) => {
  const {
    invoice
  } = req.params;
  console.log(req.params.invoice)
  pool.query(`select * from bill where id=?`, [req.params.invoice], (error, result) => {
    if (error) {
      console.log(error)
    } else {

      pool.query(`select * from billproduct where invoiceno=?`, [req.params.invoice], (cerror, cresult) => {
        if (error) {
          console.log(error)
        } else {
          console.log("Bill => ", result, " Billproduct => ", cresult, "   ***   ")
          res.render("storelogin/prevbillprint", {
            data: cresult,
            body: result[0],
            customer: result,
            scheme: result,
            invoice: parseInt(req.params.invoice),
            prevpoint: parseInt(result[0].pbonuspoint)
          })

        }
      })

    }
  })
})


router.get('/', (req, res) => {
  var qr = `select (select c.name from customer c where c.mobile=b.cmobile) as name,(select c.mobile from customer c where c.mobile=b.cmobile) as mobile,  (select c.ccard from customer c where c.mobile=b.cmobile) as ccard,  (select c.address from customer c where c.mobile=b.cmobile) as address,  count(b.cmobile) as count from bill b  group by b.cmobile`

  var qr1 = `select c.name,c.mobile,c.ccard,c.address,count(b.cmobile) as count from bill b,customer c where c.mobile=b.cmobile group by b.cmobile,b.cname,c.name,c.ccard,c.address LIMIT 30`


  if (req.session.adminId) {
    pool.query(qr1,(err, result) => {
       if (err) {
        console.log(err);
      } else {
      //  console.log(result)
        res.render("customer/customeradmin", {
          data: result
        })
        // res.render("gstper/gstper",{data:result})
        //res.send(result)
      }
    })

  } else {
    res.send('Invalid')
  }
})




////////////////////customer searchfilter
router.post('/searchfilter', (req, res) => {
  console.log(req.body)
  var qr = " "
global.a=req.body.btn
  var ccard = 0
  if (req.body.ccard) {
    ccard = req.body.ccard
  }

  var mobile = 0
  if (req.body.mobile) {
    mobile = req.body.mobile
  }

  var date1 = 0
  var date2 = 0
  if (req.body.date1) {
    date1 = req.body.date1
  }
  if (req.body.date2) {
    date2 = req.body.date2
  }
  else {

  }
//console.log('body data---',ccard ,"--",mobile,"--",date1,"--",date2);

  if(ccard != 0 && mobile == 0 && date1 == 0 && date2== 0 ){
    qr = `select b.id,c.name,c.mobile,c.ccard,c.address,count(b.cmobile) as count from bill b join customer c on b.cmobile=c.mobile  where  c.ccard=${ccard} group by b.id,c.name,c.mobile,c.ccard,c.address`
  }
  else if(ccard == 0 && mobile != 0 && date1 == 0 && date2== 0 ){
    qr = `select b.id,c.name,c.mobile,c.ccard,c.address,count(b.cmobile) as count from bill b join customer c on b.cmobile=c.mobile  where  b.cmobile=${mobile} group by b.id,c.name,c.mobile,c.ccard,c.address`
  }
  else if(ccard != 0 && mobile != 0 && date1 == 0 && date2== 0 ){
    qr = `select b.id,c.name,c.mobile,c.ccard,c.address,count(b.cmobile) as count from bill b join customer c on b.cmobile=c.mobile  where  b.cmobile=${mobile} and c.ccard=${ccard} group by b.id,c.name,c.mobile,c.ccard,c.address`
  }
  else if(ccard == 0 && mobile == 0 && date1 != 0 && date2 != 0 ){
    qr = `select b.id,c.name,c.mobile,c.ccard,c.address,count(b.cmobile) as count from bill b join customer c on b.cmobile=c.mobile where b.date_register between '${date1}' and '${date2}' group by b.id,c.name,c.mobile,c.ccard,c.address`
  }
  else if(ccard != 0 && mobile == 0 && date1 != 0 && date2 != 0 ){
    qr = `select b.id,c.name,c.mobile,c.ccard,c.address,count(b.cmobile) as count from bill b join customer c on b.cmobile=c.mobile where c.ccard=${ccard} and b.date_register between '${date1}' and '${date2}' group by b.id,c.name,c.mobile,c.ccard,c.address`
  }
  else if(ccard == 0 && mobile != 0 && date1 != 0 && date2 != 0 ){
    qr = `select b.id,c.name,c.mobile,c.ccard,c.address,count(b.cmobile) as count from bill b join customer c on b.cmobile=c.mobile where b.cmobile=${mobile} and b.date_register between '${date1}' and '${date2}' group by b.id,c.name,c.mobile,c.ccard,c.address`
  }
  else if(ccard != 0 && mobile != 0 && date1 != 0 && date2 != 0 ){
    qr = `select b.id,c.name,c.mobile,c.ccard,c.address,count(b.cmobile) as count from bill b join customer c on b.cmobile=c.mobile where b.cmobile=${mobile} and c.ccard=${ccard} and b.date_register between '${date1}' and '${date2}' group by b.id,c.name,c.mobile,c.ccard,c.address`
  }
  else {
    qr = `select b.id,c.name,c.mobile,c.ccard,c.address,count(b.cmobile) as count from bill b join customer c  on b.cmobile=c.mobile group by b.id,c.name,c.mobile,c.ccard,c.address`
  }
  
  console.log("Query ",qr)
  if(global.a=='Filter'){  pool.query(`${qr}`, function (err, result) {
    if (err) {
      console.log(err)
    } else {
      // console.log(result)
      res.render("customer/customeradmin", {
        data: result
      })
    }
  })}
  else{
    pool.query(`${qr}`, function (err, result) {
      if (err) {
        res.json(err)
      } else {
        res.xls(`SearchFilterCustomerList - ${(new Date()).toLocaleDateString()}.xlsx`, result);
      }
    })

  }
})


module.exports = router;