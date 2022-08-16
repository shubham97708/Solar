const router = require('express').Router();
const pool = require('./pool');
const json2xls = require('json2xls');
const express = require('express');
router.use(json2xls.middleware);
router.get('/', (req, res) => {



   res.render('SoldBillProduct/soldbillproduct',{data:''})
})

router.post('/searchfilter', (req, res) => {
    global.a=req.body.btn
     console.log(req.body)
     var qr = " "
     var limit=0
     var invoiceno = 0
     if (req.body.invoiceno) {
         invoiceno = req.body.invoiceno
        
     }
 
     var brand = 0
     if (req.body.brandid) {
         brand = req.body.brandid
        
     }
 
     var model = 0
     if (req.body.modelid) {
         model = req.body.modelid
       
     }

     var pricefrom = 0
     var priceto = 0
     if (req.body.pricefrom) {
         pricefrom = req.body.pricefrom
        
     }
     if (req.body.priceto) {
         priceto = req.body.priceto
         
     }
 
     var date1 = 0000-00-00
     var date2 = 0000-00-00
     if (req.body.date1) {
         date1 = req.body.date1
        
     }
     if (req.body.date2) {
         date2 = req.body.date2
         
     }
     if(req.body.limit){
         limit=req.body.limit
 
     }
    if(limit=="All"){
 
     if(req.body.modelid==0)
     {qr=`b.invoiceno=${invoiceno} or b.modelid=${model} or b.brandid=${brand} or b.price between '${pricefrom}' and '${priceto}' or  b.register_date between '${date1}' and '${date2}' and b.status='True' group by b.invoiceno `
  } else {
      qr = `b.invoiceno=${invoiceno} or b.modelid=${model} and b.brandid=${brand} or b.price between '${pricefrom}' and '${priceto}'  or b.register_date between '${date1}' and '${date2}' and b.status='True' group by b.invoiceno `
   } 
 
    
    }
  
  //  qr=`select * ,(select v.firmname from vendor v where v.id=f.vendorid) as vendor,(select b.name from brand b where b.id=f.brandid) as brand,(select m.name from model m where m.id=f.modelid) as model from feedstock f where `+ex_qr+` group by f.id limit 2 `
 
      //  qr=`select *,(select v.firmname from vendor v where v.id=f.vendorid) as vendor,(select b.name from brand b where b.id=f.brandid) as brand,(select m.name from model m where m.id=f.modelid) as model, from feedstock f where f.vendorid=${vendor} or  f.brandid=${brand}   or  f.modelid=${model}   or    b.date_register between '${date1}' and '${date2}' `
 
   //  qr = `select (select v.firmname from vendor v where v.id=f.vendorid ) as vendor ,(select b.name from brand b where b.id=f.brandid ) as brand,from feedstock f  where f.vendorid=${2} group by f.id `
     console.log(req.body)
     if(req.body.modelid==0 && limit!="All")
    {qr=`b.invoiceno=${invoiceno} or b.modelid=${model} or b.brandid=${brand} or b.price between '${pricefrom}' and '${priceto}' or  b.register_date between '${date1}' and '${date2}' and b.status='True' group by b.invoiceno  limit ${limit}`
 } else if(limit!="All"){
     qr = `b.invoiceno=${invoiceno} or b.modelid=${model} and b.brandid=${brand} or b.price between '${pricefrom}' and '${priceto}' or  b.register_date between '${date1}' and '${date2}' and b.status='True' group by b.invoiceno limit ${limit}`
  } var r = `select b.status,b.invoiceno,b.ptype,b.brandname,b.modelname,(select categories.name from categories where categories.id=b.categoriesid ) as categoryname,b.modelno,b.color,b.price,b.qty,b.imeimob,b.register_date from billproduct b where ` + qr
    console.log("Query ", r)
    if(a=='Filter'){
     pool.query(`${r}`, function (err, result) {
         if (err) {
             console.log(err)
         } else {
             console.log("passssssssssssssssssssssssss", result)
          //   res.render("customer/customeradmin", {
              res.render('SoldBillProduct/soldbillproduct',{data:result}) 
             }
          } )}
          else{
             pool.query(`${r}`, function (err, result) {
               if (err) {
                 res.json(err)
               } else {
                 res.xls(`SearchFilterSoldProductList - ${(new Date()).toLocaleDateString()}.xlsx`, result);
               }
             })
         
           }    
         
 
 })
 
module.exports=router;
