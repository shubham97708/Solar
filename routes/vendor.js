const router = require('express').Router();
const pool = require('./pool');
const json2xls = require('json2xls');
const express = require('express');
router.use(json2xls.middleware);

const table = 'vendor'

 router.get('*', (req, res, next) => {
    if(req.session.adminId){
        next()
    }
    
    else{
        res.redirect('/admin')
       }
    
})
 

router.get('/', (req, res) => {
    res.render('vendor/new');
})



router.post('/create', (req, res) => {
    console.log(req.body)
    pool.query(`insert into ${table} set ?`, req.body, (err, result) => {
        if (err) throw err;
        else {
            all(res)
        }
    })
})

function all(res) {
    pool.query(`select * from ${table}`, (err, result) => {
        if (err) throw err;
        else {
            res.render('vendor/all', {
                data: result
            })
        };
    })
}

router.get('/all', (req, res) => {
    all(res);
})

router.get('/allJSON', (req, res) => {
    pool.query(`select * from ${table}`, (err, result) => {
        if (err) throw err;
        else {
            res.json(result)
        };
    })
})


router.get('/details/:id', (req, res) => {
    const {
        id
    } = req.params;
    const queries = `select m.name, m.modelno, m.color, c.name as company, s.* from stock s, store st, mobile m, company c where s.storeid = ? and s.storeid = st.id and  m.id = s.mobileid and m.companyid = c.id;` +
        `select * from store where id = ?`
    pool.query(queries, [id, id], (err, result) => {
        if (err) throw err;
        else {
            res.render('vendor/details', {
                data: result[0],
                ...result[1][0]
            })
        }
    })
})

router.get('/edit/:id', (req, res) => {
    const {
        id
    } = req.params;
    pool.query(`select * from ${table} where id = ?`, id, (err, result) => {
        if (err) throw err;
        else {
            res.render('vendor/edit', {
                ...result[0]
            })
        }
    })
})


router.post('/update', (req, res) => {
    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if (err) throw err;
        else {
            all(res)
        }
    })
})

router.get('/delete/:id', (req, res) => {
    const {
        id
    } = req.params;
    pool.query(`delete from ${table} where id = ?`, id, (err, result) => {
        if (err) throw err;
        else {
            all(res)
        }
    })
})





router.get('/vendorall', (req, res) => {
    const queries = `select * from ${table}`
    pool.query(queries, (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json([]);
        } else {
            //console.log(result)
            res.status(200).json(result);
        }
    })
});


router.get('/vendorstock', (req, res) => {
    console.log('vender stock',req.body)
    var qr = " "
    var limit = 0
    if (req.body.limit) {
        limit = req.body.limit
    }
    var vendor = 0
    if (req.body.vendorid) {
        vendor = req.body.vendorid
    }

    var brand = 0
    if (req.body.brandid) {
        brand = req.body.brandid
    }

    var model = 0
    if (req.body.modelid) {
        model = req.body.modelid
    }

    var date1 = 0
    var date2 = 0
    if (req.body.date1) {
        date1 = req.body.date1
    }
    if (req.body.date2) {
        date2 = req.body.date2
    }
   else{

   }


    // if(vendor != 0 && brand ==0 && model==0 && date1==0 && date2==0 && limit !=0){
    //     qr=`select *,(select v.firmname from vendor v where v.id=f.vendorid) as vendor,(select b.name from brand b where b.id=f.brandid) as brand,(select m.name from model m where m.id=f.modelid) as model from feedstock f where f.vendorid=${vendor} and limit=${limit}`

    // }  
    // else if(vendor == 0 && brand !=0 && model==0 && date1==0 && date2==0 && limit !=0){
    //     qr=`select *,(select v.firmname from vendor v where v.id=f.vendorid) as vendor,(select b.name from brand b where b.id=f.brandid) as brand,(select m.name from model m where m.id=f.modelid) as model from feedstock f where  f.brandid=${brand}  and limit=${limit}`

    // }
    // else if(vendor == 0 && brand !=0 && model!=0 && date1==0 && date2==0 && limit !=0){
    //     qr=`select *,(select v.firmname from vendor v where v.id=f.vendorid) as vendor,(select b.name from brand b where b.id=f.brandid) as brand,(select m.name from model m where m.id=f.modelid) as model from feedstock f where f.brandid=${brand} and f.modelid=${model} and limit=${limit}`

    // }
    // else if(vendor == 0 && brand ==0 && model==0 && date1!=0 && date2!=0 && limit !=0){
    //     qr=`select *,(select v.firmname from vendor v where v.id=f.vendorid) as vendor,(select b.name from brand b where b.id=f.brandid) as brand,(select m.name from model m where m.id=f.modelid) as model from feedstock f where   b.date_register between '${date1}' and '${date2}' and limit=${limit}`

    // }
    // else{
    //     qr=`select *,(select v.firmname from vendor v where v.id=f.vendorid) as vendor,(select b.name from brand b where b.id=f.brandid) as brand,(select m.name from model m where m.id=f.modelid) as model from feedstock f limit 50`

    // }
    qr=`select *,(select v.firmname from vendor v where v.id=f.vendorid) as vendor,(select b.name from brand b where b.id=f.brandid) as brand,(select m.name from model m where m.id=f.modelid) as model from feedstock f limit 50`

   
     //   qr=`select (select v.firmname from vendor v where v.id=f.vendorid) as vendor,(select b.name from brand b where b.id=f.brandid) as brand,(select m.name from model m where m.id=f.modelid) as model, from feedstock f where f.vendorid=${vendor} or  f.brandid=${brand}   or  f.modelid=${model}   or    b.date_register between '${date1}' and '${date2}' `

  //  qr = `select (select v.firmname from vendor v where v.id=f.vendorid ) as vendor ,(select b.name from brand b where b.id=f.brandid ) as brand,from feedstock f  where f.vendorid=${2} group by f.id `
   
    console.log("Query ", qr)
    pool.query(`${qr}`, function (err, result) {
        if (err)
         {
            console.log(err)
            res.send(err);
        } else {
            console.log(result)
            res.render('vendor/vendorstock', {
                data: result
            });
        }
    })
});




router.post('/searchfilter', (req, res) => {

   global.a=req.body.btn
    console.log('vender stock search filter',req.body)
    var qr = " "
    var imei=0;
    var limit=0
    var vendor = 0
    if (req.body.imeis) {
        imei = req.body.imeis
       
    }

    if (req.body.vendorid) {
        vendor = req.body.vendorid
       
    }

    var brand = 0
    if (req.body.brandid) {
        brand = req.body.brandid
       
    }

    var model = 0
    if (req.body.modelid) {
        model = req.body.modelid
      
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
    else{

    }

   // qr = `f.vendorid=${vendor} or f.imeino=${imei}  or f.modelid=${model} and f.brandid=${brand} or f.date_register between '${date1}' and '${date2}' limit ${limit}`


if(vendor !=0 && imei ==0 && brand ==0 && model ==0 && date1 ==0 && date2 ==0 && limit !=0){
    qr = `f.vendorid=${vendor} limit ${limit}`
}
else if(vendor ==0 && imei !=0 && brand ==0 && model ==0 && date1 ==0 && date2 ==0 && limit !=0){
    qr = ` f.imeino=${imei} limit ${limit}`
}
else if(vendor ==0 && imei ==0 && brand !=0 && model ==0 && date1 ==0 && date2 ==0 && limit !=0){
    qr = ` f.brandid=${brand} limit ${limit}`
}
else if(vendor ==0 && imei ==0 && brand !=0 && model !=0 && date1 ==0 && date2 ==0 && limit !=0){
    qr = ` f.brandid=${brand} and f.modelid=${model} limit ${limit}`
}
else if(vendor ==0 && imei ==0 && brand ==0 && model ==0 && date1 !=0 && date2 !=0 && limit !=0){
    qr = ` f.date_register between '${date1}' and '${date2}' limit ${limit}`
}
//
else if(vendor !=0 && imei !=0 && brand ==0 && model ==0 && date1 ==0 && date2 ==0 && limit !=0){
    qr = `f.vendorid=${vendor} and f.imeino=${imei} limit ${limit}`
}
else if(vendor !=0 && imei ==0 && brand !=0 && model ==0 && date1 ==0 && date2 ==0 && limit !=0){
    qr = `f.vendorid=${vendor} and f.brandid=${brand} limit ${limit}`
}
else if(vendor !=0 && imei ==0 && brand !=0 && model ==0 && date1 ==0 && date2 ==0 && limit !=0){
    qr = `f.vendorid=${vendor} and f.brandid=${brand} limit ${limit}`
}
else if(vendor !=0 && imei ==0 && brand !=0 && model !=0 && date1 ==0 && date2 ==0 && limit !=0){
    qr = `f.vendorid=${vendor} and f.brandid=${brand} and f.modelid=${model} limit ${limit}`
}
else if(vendor !=0 && imei ==0 && brand ==0 && model ==0 && date1 !=0 && date2 !=0 && limit !=0){
    qr = `f.vendorid=${vendor} and f.date_register between '${date1}' and '${date2}' limit ${limit}`
}
//


else if(vendor ==0 && imei !=0 && brand !=0 && model ==0 && date1 ==0 && date2 ==0 && limit !=0){
    qr = `f.imeino=${imei} and f.brandid=${brand} limit ${limit}`
}
else if(vendor ==0 && imei !=0 && brand !=0 && model !=0 && date1 ==0 && date2 ==0 && limit !=0){
    qr = `f.imeino=${imei} and f.brandid=${brand} and f.modelid=${model} limit ${limit}`
}
else if(vendor ==0 && imei !=0 && brand ==0 && model ==0 && date1 !=0 && date2 !=0 && limit !=0){
    qr = `f.imeino=${imei} and f.date_register between '${date1}' and '${date2}' limit ${limit}`
}
//
else if(vendor !=0 && imei !=0 && brand !=0 && model ==0 && date1 ==0 && date2 ==0 && limit !=0){
    qr = `f.vendorid=${vendor} and f.imeino=${imei} and f.brandid=${brand}  limit ${limit}`
}
else if(vendor !=0 && imei !=0 && brand !=0 && model !=0 && date1 ==0 && date2 ==0 && limit !=0){
    qr = `f.vendorid=${vendor} and f.imeino=${imei} and f.brandid=${brand} and f.modelid=${model}  limit ${limit}`
}
//
else if(vendor !=0 && imei !=0 && brand !=0 && model ==0 && date1 !=0 && date2 !=0 && limit !=0){
    qr = `f.vendorid=${vendor} and f.imeino=${imei} and f.brandid=${brand} and f.date_register between '${date1}' and '${date2}' limit ${limit}`
}
else if(vendor !=0 && imei !=0 && brand !=0 && model !=0 && date1 !=0 && date2 !=0 && limit !=0){
    qr = `f.vendorid=${vendor} and f.imeino=${imei} and f.brandid=${brand} and f.modelid=${model} and f.date_register between '${date1}' and '${date2}' limit ${limit}`
}
// if(imei!=0){
//     qr=` f.imeino=${imei}`
// }
//    else{

//     if(vendor!=0 ){
//         if(limit=="All"){

//             if(req.body.modelid==0)
//             {
//             qr=`f.vendorid=${vendor} and (f.imeino=${imei} or f.modelid=${model} or f.brandid=${brand} or f.date_register between '${date1}' and '${date2}') `
//          } else {
//              qr = `f.vendorid=${vendor} and ( f.vendorid=${vendor} or f.imeino=${imei} or f.modelid=${model} and f.brandid=${brand} or f.date_register between '${date1}' and '${date2}')`
//           } 
        
           
//            }
         
//          //  qr=`select * ,(select v.firmname from vendor v where v.id=f.vendorid) as vendor,(select b.name from brand b where b.id=f.brandid) as brand,(select m.name from model m where m.id=f.modelid) as model from feedstock f where `+ex_qr+` group by f.id limit 2 `
        
//              //  qr=`select *,(select v.firmname from vendor v where v.id=f.vendorid) as vendor,(select b.name from brand b where b.id=f.brandid) as brand,(select m.name from model m where m.id=f.modelid) as model, from feedstock f where f.vendorid=${vendor} or  f.brandid=${brand}   or  f.modelid=${model}   or    b.date_register between '${date1}' and '${date2}' `
        
//           //  qr = `select (select v.firmname from vendor v where v.id=f.vendorid ) as vendor ,(select b.name from brand b where b.id=f.brandid ) as brand,from feedstock f  where f.vendorid=${2} group by f.id `
//             console.log(req.body)
//             if(req.body.modelid==0 && limit!="All")
//            {qr=`f.vendorid=${vendor} and (f.imeino=${imei} or f.modelid=${model} or f.brandid=${brand} or f.date_register between '${date1}' and '${date2}') limit ${limit}`
//         } else if(limit!="All"){
//             qr = `f.vendorid=${vendor} and ( f.imeino=${imei}  or f.modelid=${model} and f.brandid=${brand} or f.date_register between '${date1}' and '${date2}') limit ${limit}`
//          }   

//     }
//     else{
//    if(limit=="All"){

//     if(req.body.modelid==0)
//     {
//     qr=`f.vendorid=${vendor} or f.imeino=${imei} or f.modelid=${model} or f.brandid=${brand} or f.date_register between '${date1}' and '${date2}' `
//  } else {
//      qr = `f.vendorid=${vendor} or f.imeino=${imei} or f.modelid=${model} and f.brandid=${brand} or f.date_register between '${date1}' and '${date2}'`
//   } 

   
//    }
 
//  //  qr=`select * ,(select v.firmname from vendor v where v.id=f.vendorid) as vendor,(select b.name from brand b where b.id=f.brandid) as brand,(select m.name from model m where m.id=f.modelid) as model from feedstock f where `+ex_qr+` group by f.id limit 2 `

//      //  qr=`select *,(select v.firmname from vendor v where v.id=f.vendorid) as vendor,(select b.name from brand b where b.id=f.brandid) as brand,(select m.name from model m where m.id=f.modelid) as model, from feedstock f where f.vendorid=${vendor} or  f.brandid=${brand}   or  f.modelid=${model}   or    b.date_register between '${date1}' and '${date2}' `

//   //  qr = `select (select v.firmname from vendor v where v.id=f.vendorid ) as vendor ,(select b.name from brand b where b.id=f.brandid ) as brand,from feedstock f  where f.vendorid=${2} group by f.id `
//     console.log(req.body)
//     if(req.body.modelid==0 && limit!="All")
//    {qr=`f.vendorid=${vendor} or f.imeino=${imei} or f.modelid=${model} or f.brandid=${brand} or f.date_register between '${date1}' and '${date2}' limit ${limit}`
// } else if(limit!="All"){
    else{
        qr = `f.vendorid=${vendor} or f.imeino=${imei}  or f.modelid=${model} and f.brandid=${brand} or f.date_register between '${date1}' and '${date2}' limit ${limit}`

    }        

    
 var r = `select id,(select v.firmname from vendor v where v.id=f.vendorid) as vendor,(select m.name from model m where m.id=f.modelid) as model,(select b.name from brand b where b.id=f.brandid) as brand,f.imeino,f.date_register,f.storename from feedstock f where ` + qr
   console.log("Query ", r)
   if(a=='Filter'){
    pool.query(`${r}`, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            console.log("passssssssssssssssssssssssss", result)
         //   res.render("customer/customeradmin", {
             res.render('vendor/vendorstock',{data:result}) 
            }
         } )}
         else{
            pool.query(`${r}`, function (err, result) {
              if (err) {
                res.json(err)
              } else {
                res.xls(`SearchFilterVendorList - ${(new Date()).toLocaleDateString()}.xlsx`, result);
              }
            })
        
          }    
        

})





module.exports = router;