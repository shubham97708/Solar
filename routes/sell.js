const router = require('express').Router();
const pool = require('./pool');
const json2xls = require('json2xls');
const express = require('express');
router.use(json2xls.middleware);


//For Admin  Bill View
router.get('/', (req, res) => {
    if (req.session.adminId) {
        var store = ''
        pool.query(`select * from store`, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                store = result
                console.log(store)
            }
        })
        pool.query(`Select * from  bill where status = "True" ORDER BY date_register  DESC LIMIT 30`, (err, result) => {
            //MYSQL DATE concatenete Start
            /* var rawstr = result[0].register_date;
             var str =rawstr.toString();
             var rawdate = str.split(' ');
             var finaldate = rawdate[0]+"  "+rawdate[2]+"-"+rawdate[1]+"-"+rawdate[3]+"  "+rawdate[4]*/
            //MYSQL DATE concatenete END

            res.render("sell/sell", {
                data: result,
                date: 0,
                store: store
            })
            // res.render("gstper/gstper",{data:result})
        })

    } else {
        res.send('Invalid')
    }
})






const query = `select t.id, t.storeid, t.imeino, (select modelno from model where id = (select modelid from feedstock where imeino = t.imeino)) as modelno, (select name from store where id = t.storeid ) as store, t.date from sold t order by date desc`;
   

// Bill Product For Admin BY IMEI
router.post('/billproductbyimei', (req, res) => {
    console.log(req.body)
    pool.query(`select * from billproduct where imeimob = ?`, req.body.mbl, (err, result) => {

  // pool.query(`select T1.* , T3.firmname  from  billproduct T1, feedstock T2 , vendor T3  where T1.imeimob = T2.imeino and T1.imeimob = ? and T2.imeino  =?   `,[ req.body.mbl , req.body.mbl ], (err, result) => {

       //     pool.query(`select T1.* , (select T3.firmname from vendor T3 where T3.id=T2.vendorid) as firmname  from  billproduct T1, feedstock T2   where T1.imeimob = T2.imeino   and T2.imeino in (SELECT   imeimob from billproduct where invoiceno in (SELECT invoiceno from billproduct where imeimob = ? ))`,[req.body.mbl], (err, result) => {


        if (err) {
            console.log(err);
            res.json({
                result: 'FAIL'
            })
        } else {
            console.log("New Sell ", result)

            res.json({
                result: result,
            
            })

        }
    })
})



router.get('/imeisoldbillview', (req, res) => {
    if (req.session.adminId) {
            res.render("sell/sellimei")
    } else {
        res.send('Invalid')
    }
})






// Cancelld Bill View Only
router.get('/cancel', (req, res) => {
    if (req.session.adminId) {
        var store = ''
        pool.query(`select * from store`, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                store = result
                console.log(store)
            }
        })
        pool.query(`Select * from  bill where status = "False" ORDER BY date_register  DESC`, (err, result) => {
            //MYSQL DATE concatenete Start
            /* var rawstr = result[0].register_date;
             var str =rawstr.toString();
             var rawdate = str.split(' ');
             var finaldate = rawdate[0]+"  "+rawdate[2]+"-"+rawdate[1]+"-"+rawdate[3]+"  "+rawdate[4]*/
            //MYSQL DATE concatenete END

            res.render("sell/cancel", {
                data: result,
                date: 0,
                store: store
            })
            // res.render("gstper/gstper",{data:result})
        })

    } else {
        res.send('Invalid')
    }
})










//For store  Bill View
router.get('/store', (req, res) => {
    console.log("id   hjjjjjjjjjjjjjjjjjjjjjjjjjjj             ",req.query.id)
    if (req.session.storeId) {
        pool.query(`Select * from  bill where storeid = ? ORDER BY date_register  DESC `, req.session.storeId, (err, result) => {
            //MYSQL DATE concatenete Start
            /* var rawstr = result[0].register_date;
             var str =rawstr.toString();
             var rawdate = str.split(' ');
             var finaldate = rawdate[0]+"  "+rawdate[2]+"-"+rawdate[1]+"-"+rawdate[3]+"  "+rawdate[4]*/
            //MYSQL DATE concatenete END
           // console.log(result)
            res.render("sell/sellstore", {
                data: result,
                date: 0,
                st_id:req.query.id
            })
            // res.render("gstper/gstper",{data:result})
        })
    } else {
        res.send('Invalid')
    }

})



// Bill Product For Admin
router.post('/billproduct', (req, res) => {
    console.log(req.body)
    pool.query(`select * from billproduct where invoiceno = ?`, req.body.mbl, (err, result) => {
        if (err) {
            console.log(err);
            res.json({
                result: 'FAIL'
            })
        } else {
            console.log("New Sell ", result)

            res.json({
                result: result
            })

        }
    })
})








router.post('/searchfilterstore', (req, res) => {

    console.log(req.body)
    var qr = " "
    var st_id=req.body.st_id
    var store = 0
    if (req.body.store) {
        store = req.body.store
    }

    var id = 0
    if (req.body.invoiceno) {
        id = req.body.invoiceno
    }

    var mobileno = 0
    if (req.body.mobileno) {
        mobileno = req.body.mobileno
    }

    var mobileno = 0
    if (req.body.mobileno) {
        mobileno = req.body.mobileno
    }

    var paytype = 0
    if (req.body.paytype) {
        paytype = req.body.paytype
    }

    var fcname = 0
    if (req.body.fcname) {
        fcname = req.body.fcname
    }

    var fcname = 0
    if (req.body.fcname) {
        fcname = req.body.fcname
    }

    var cardno = 0
    if (req.body.cardno) {
        cardno = req.body.cardno
    }

    var date1 = 0
    var date2 = 0
    if (req.body.date1) {
        date1 = req.body.date1
    }
    if (req.body.date2) {
        date2 = req.body.date2
    }
    console.log("sttttttttttttttttttttttttttttttttttt",st_id)
    if(store != 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
        qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno} and  date_register between '${date1}' and '${date2}'`
    }
    else if(store != 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `storeid=${store}`    
    }
    else if(store == 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `id=${id}`    
    }
    else if(store == 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `cmobile=${mobileno}`    
    }
    else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `paytype='${paytype}'`    
    }
    else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `fcname='${fcname}'`    
    }
    else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
        qr = `ccard=${cardno}`    
    }
    else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2== 0){
        qr = `date_register='${date1}'`    
    }
    else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2!= 0){
        qr = `date_register='${date2}'`    
    }
    //2
    //2.1
    else if(store != 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `storeid=${store} and id=${id}` 
    }
    else if(store != 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `storeid=${store} and cmobile=${mobileno}` 
    }
    else if(store != 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `storeid=${store} and paytype='${paytype}'`
    }
    else if(store != 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
          qr = `storeid=${store} and fcname='${fcname}'`   
    }
    else if(store != 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
          qr = `storeid=${store} and ccard=${cardno}`   
    }
    else if(store != 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2== 0){
          qr = `storeid=${store} and date_register='${date1}'`   
    }
    else if(store != 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2!= 0){
          qr = `storeid=${store} and date_register='${date2}'` 
    }
    //2.2
   
    else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `id=${id} and cmobile=${mobileno}` 
    }
    else if(store == 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `id=${id} and paytype='${paytype}'`
    }
    else if(store == 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
          qr = `id=${id} and fcname='${fcname}'`   
    }
    else if(store == 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
          qr = `id=${id} and ccard=${cardno}`   
    }
    else if(store == 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2== 0){
          qr = `id=${id} and date_register='${date1}'`   
    }
    else if(store == 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2!= 0){
          qr = `id=${id} and date_register='${date2}'` 
    }
    //2.3
       
    else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `cmobile=${mobileno} and paytype='${paytype}'`
    }
    else if(store == 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
          qr = `cmobile=${mobileno} and fcname='${fcname}'`   
    }
    else if(store == 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
          qr = `cmobile=${mobileno} and ccard=${cardno}`   
    }
    else if(store == 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2== 0){
          qr = `cmobile=${mobileno} and date_register='${date1}'`   
    }
    else if(store == 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2!= 0){
          qr = `cmobile=${mobileno} and date_register='${date2}'` 
    }
//2.4
       

else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
      qr = `paytype='${paytype}' and fcname='${fcname}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
      qr = `paytype='${paytype}' and ccard=${cardno}`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2== 0){
      qr = `paytype='${paytype}' and date_register='${date1}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2!= 0){
      qr = `paytype='${paytype}' and date_register='${date2}'` 
}

//2.5
       

else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `fcname='${fcname}' and ccard=${cardno}`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2== 0){
    qr = `fcname='${fcname}' and date_register='${date1}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2!= 0){
    qr = `fcname='${fcname}' and date_register='${date2}'` 
}
//2.6

else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2== 0){
    qr = `ccard=${cardno} and date_register='${date1}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2!= 0){
    qr = `ccard=${cardno} and date_register='${date2}'` 
}
//2.7

else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `date_register between '${date1}' and '${date2}'` 
}

   
    //3
//3.1

else if(store != 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and id=${id} and cmobile=${mobileno}` 
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and id=${id} and paytype='${paytype}'`
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
      qr = `storeid=${store} and id=${id} and fcname='${fcname}'`   
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
      qr = `storeid=${store} and id=${id} and ccard=${cardno}`   
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2== 0){
      qr = `storeid=${store} and id=${id} and date_register='${date1}'`   
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2!= 0){
      qr = `storeid=${store} and id=${id} and date_register='${date2}'` 
}
//3.2


else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
    qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}'`
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
      qr = `id=${id} and cmobile=${mobileno} and fcname='${fcname}'`   
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
      qr = `id=${id} and cmobile=${mobileno} and ccard=${cardno}`   
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2== 0){
      qr = `id=${id} and cmobile=${mobileno} and date_register='${date1}'`   
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2!= 0){
      qr = `id=${id} and cmobile=${mobileno} and date_register='${date2}'` 
}
//3.3
else if(store != 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and cmobile=${mobileno} and paytype='${paytype}'`   
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and ccard=${cardno}`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
      qr = `cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}'`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
      qr = `cmobile=${mobileno} and paytype='${paytype}' and ccard=${cardno}`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2== 0){
      qr = `cmobile=${mobileno} and paytype='${paytype}' and date_register='${date1}'`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2!= 0){
      qr = `cmobile=${mobileno} and paytype='${paytype}' and date_register='${date2}'` 
}
//3.4
   
else if(store != 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
    qr = `storeid=${store}  and paytype='${paytype}' and fcname='${fcname}'`   
}
else if(store == 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
    qr = `id=${id} and paytype='${paytype}' and fcname='${fcname}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
  qr = `paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno}`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2== 0){
  qr = `paytype='${paytype}' and fcname='${fcname}' and date_register='${date1}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2!= 0){
  qr = `paytype='${paytype}' and fcname='${fcname}' and date_register='${date2}'` 
}

//3.5
   
else if(store != 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and fcname='${fcname}' and ccard=${cardno}`   
}
else if(store == 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `id=${id} and fcname='${fcname}' and ccard=${cardno}`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `cmobile=${mobileno} and fcname='${fcname}' and ccard=${cardno}`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2== 0){
qr = `fcname='${fcname}' and ccard=${cardno} and date_register='${date1}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2!= 0){
qr = `fcname='${fcname}' and ccard=${cardno} and date_register='${date2}'` 
}

//3.6
else if(store != 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and date_register between '${date1}' and '${date2}'`   
}
else if(store == 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and and date_register between '${date1}' and '${date2}'`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `cmobile=${mobileno} and date_register between '${date1}' and '${date2}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
qr = `paytype='${paytype}' and date_register between '${date1}' and '${date2}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
qr = `fcname='${fcname}' and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
qr = `ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}


//4    


//4.1

else if(store != 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and paytype='${paytype}'`
}
else if(store != 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
      qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and fcname='${fcname}'`   
}
else if(store != 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
      qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and ccard=${cardno}`   
}
else if(store != 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2== 0){
      qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and date_register='${date1}'`   
}
else if(store != 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2!= 0){
      qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and date_register='${date2}'` 
}

//4.2


else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
      qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}'`   
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
      qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and ccard=${cardno}`   
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2== 0){
      qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and date_register='${date1}'`   
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2!= 0){
      qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and date_register='${date2}'` 
}
//4.3
else if(store != 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}'`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
      qr = `cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno}`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2== 0){
      qr = `cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}' and date_register='${date1}'`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2!= 0){
      qr = `cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}' and date_register='${date2}'` 
}
//4.4
   
else if(store != 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname} and ccard=${cardno}'`   
}
else if(store == 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
      qr = `id=${id} and paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno}`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2== 0){
  qr = `paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno} and date_register='${date1}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2!= 0){
  qr = `paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno} and date_register='${date2}'` 
}

//4.5
else if(store != 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and ccard=${cardno}  and date_register between '${date1}' and '${date2}'`   
}
else if(store == 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
      qr = `id=${id} and ccard=${cardno}  and date_register between '${date1}' and '${date2}'`   
}  
else if(store == 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `cmobile=${mobileno} and ccard=${cardno}  and date_register between '${date1}' and '${date2}'`   
}  
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `paytype='${paytype}' and ccard=${cardno}  and date_register between '${date1}' and '${date2}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
qr = `fcname='${fcname}' and ccard=${cardno}  and date_register between '${date1}' and '${date2}'` 
}
//4 mixup

else if(store != 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and id=${id} and paytype='${paytype}' and fcname='${fcname}'` 
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and id=${id} and paytype='${paytype}' and ccard=${cardno}` 
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and id=${id} and ccard=${cardno} and fcname='${fcname}'` 
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and id=${id} and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and cmobile=${mobileno} and fcname='${fcname}' and ccard=${cardno}` 
} 
else if(store != 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and cmobile=${mobileno} and paytype='${paytype}' and ccard=${cardno}` 
} 
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `id=${id} and cmobile=${mobileno} and fcname='${fcname}' and ccard=${cardno}` 
} 
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and cmobile=${mobileno} and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and paytype='${paytype}' and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and fcname='${fcname}' and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store}  and cmobile=${mobileno} and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store}  and paytype='${paytype}' and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store}  and fcname='${fcname}' and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `paytype='${paytype}'  and fcname='${fcname}' and date_register between '${date1}' and '${date2}'` 
}

//5

//5.1


else if(store != 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
      qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}'`   
}
else if(store != 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
      qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and paytype='${paytype}' and ccard=${cardno}`   
}
else if(store != 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
      qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and date_register between '${date1}' and '${date2}'`   
}
else if(store != 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and fcname='${fcname}' and ccard=${cardno}` 
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and id=${id} and paytype='${paytype}' and date_register between '${date1}' and '${date2}'`   
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and id=${id} and fcname='${fcname}' and date_register between '${date1}' and '${date2}'`   
}

else if(store != 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and id=${id} and ccard=${cardno} and date_register between '${date1}' and '${date2}'`   
}
//5.2


else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
      qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno}`   
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
      qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and date_register between '${date1}' and '${date2}'`   
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
      qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}' and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}
//5.3
else if(store != 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}'and ccard=${cardno}`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
      qr = `cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}'and date_register between '${date1}' and '${date2}'`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
      qr = `cmobile=${mobileno} and paytype='${paytype}' and ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}
//5.4
    
else if(store != 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
qr = `storeid=${store} and fcname='${fcname}' and ccard=${cardno}  and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and fcname='${fcname}' and ccard=${cardno}  and date_register between '${date1}' and '${date2}'` 
}  
else if(store == 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and cmobile=${mobileno} and ccard=${cardno}  and date_register between '${date1}' and '${date2}'` 
} 
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
qr = `paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno}  and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and fcname='${fcname}' and paytype='${paytype}'  and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and cmobile=${mobileno} and paytype='${paytype}'  and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and cmobile=${mobileno} and fcname='${fcname}'  and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and paytype='${paytype}' and ccard=${cardno}  and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
        qr = `id=${id} and fcname='${fcname}' and paytype='${paytype}'  and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and fcname='${fcname}' and cmobile=${mobileno}  and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and paytype='${paytype}'  and cmobile=${mobileno}  and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
        qr = `cmobile=${mobileno} and fcname='${fcname}' and paytype='${paytype}' and date_register between '${date1}' and '${date2}'` 
}


//6
else if(store != 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno}` 
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store}  and paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and id=${id} and fcname='${fcname}' and ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and id=${id} and paytype='${paytype}' and ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and id=${id} and paytype='${paytype}' and fcname='${fcname}' and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}' and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}' and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and cmobile=${mobileno} and fcname='${fcname}' and ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}
    // else if(store != 0 && id!= 0 && mobileno!= 0 && paytype!= 0 ){
    //     qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and paytype=${paytype} `
    // }
    // else if(store != 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 ){
    //     qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and paytype=${paytype} and fcname=${fcname} `
    // }
    else {
        qr = `storeid=${store} or id=${id} or cmobile=${mobileno} or paytype='${paytype}' or fcname='${fcname}' or ccard=${cardno} or  date_register between '${date1}' and '${date2}'`
    
    }
    //qr = `storeid LIKE ${store} or id LIKE ${id} or cmobile LIKE ${mobileno} or paytype LIKE '${paytype}' or fcname LIKE '${fcname}' or ccard LIKE ${cardno} or  date_register between '${date1}' and '${date2}'`
    
    if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        r = `select * from bill order by id`
    }
    else
     {r = `select * from bill where ` + qr}

    // qr = `storeid=${store} or id=${id} or cmobile=${mobileno} or paytype='${paytype}' or fcname='${fcname}' or ccard=${cardno} or  date_register between '${date1}' and '${date2}'`
    // r = `select * from bill where ` + qr
    console.log("Query ", r)
    pool.query(`${r}`, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            console.log(result)
            res.render("sell/sellstore", {
                data: result,
                st_id:st_id
            })
        }
    })
})








//search filter for admin

router.post('/searchfilter', (req, res) => {
    console.log(req.body)
    global.b=req.body.btn
    var qr = " "
    
    var store = 0
    var id = 0
    var mobileno = 0
    var paytype = 0
    var fcname = 0
    var cardno = 0    
    var date1 = 0
    var date2 = 0
  
    if (req.body.store ) {
        store = req.body.store  
        //qr = `storeid=${store}`        
    }    
    if (req.body.invoiceno) {
        id = req.body.invoiceno
        //qr = `id=${id}` 
    }    
    if (req.body.mobileno) {
        mobileno = req.body.mobileno
        //qr = `cmobile=${mobileno}`    
    } 
    if (req.body.paytype) {
        paytype = req.body.paytype
       // qr = `paytype=${paytype}`  
    }    
    if (req.body.fcname) {
        fcname = req.body.fcname
        //qr = `fcname=${fcname}` 
    }    
    if (req.body.cardno) {
        cardno = req.body.cardno
        //qr = `ccard=${cardno}` 
    }
    if (req.body.date1) {
        date1 = req.body.date1
        //qr = `date_register=${date1}` 
    }
    if (req.body.date2) {
        date2 = req.body.date2
       // qr = `date_register=${date2}` 
    }   
    console.log(global.b)
    
    if(store != 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
        qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno} and  date_register between '${date1}' and '${date2}'`
    }
    else if(store != 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `storeid=${store}`    
    }
    else if(store == 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `id=${id}`    
    }
    else if(store == 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `cmobile=${mobileno}`    
    }
    else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `paytype='${paytype}'`    
    }
    else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `fcname='${fcname}'`    
    }
    else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
        qr = `ccard=${cardno}`    
    }
    else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2== 0){
        qr = `date_register='${date1}'`    
    }
    else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2!= 0){
        qr = `date_register='${date2}'`    
    }
    //2
    //2.1
    else if(store != 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `storeid=${store} and id=${id}` 
    }
    else if(store != 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `storeid=${store} and cmobile=${mobileno}` 
    }
    else if(store != 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `storeid=${store} and paytype='${paytype}'`
    }
    else if(store != 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
          qr = `storeid=${store} and fcname='${fcname}'`   
    }
    else if(store != 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
          qr = `storeid=${store} and ccard=${cardno}`   
    }
    else if(store != 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2== 0){
          qr = `storeid=${store} and date_register='${date1}'`   
    }
    else if(store != 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2!= 0){
          qr = `storeid=${store} and date_register='${date2}'` 
    }
    //2.2
   
    else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `id=${id} and cmobile=${mobileno}` 
    }
    else if(store == 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `id=${id} and paytype='${paytype}'`
    }
    else if(store == 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
          qr = `id=${id} and fcname='${fcname}'`   
    }
    else if(store == 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
          qr = `id=${id} and ccard=${cardno}`   
    }
    else if(store == 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2== 0){
          qr = `id=${id} and date_register='${date1}'`   
    }
    else if(store == 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2!= 0){
          qr = `id=${id} and date_register='${date2}'` 
    }
    //2.3
       
    else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        qr = `cmobile=${mobileno} and paytype='${paytype}'`
    }
    else if(store == 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
          qr = `cmobile=${mobileno} and fcname='${fcname}'`   
    }
    else if(store == 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
          qr = `cmobile=${mobileno} and ccard=${cardno}`   
    }
    else if(store == 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2== 0){
          qr = `cmobile=${mobileno} and date_register='${date1}'`   
    }
    else if(store == 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2!= 0){
          qr = `cmobile=${mobileno} and date_register='${date2}'` 
    }
//2.4
       

else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
      qr = `paytype='${paytype}' and fcname='${fcname}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
      qr = `paytype='${paytype}' and ccard=${cardno}`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2== 0){
      qr = `paytype='${paytype}' and date_register='${date1}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2!= 0){
      qr = `paytype='${paytype}' and date_register='${date2}'` 
}

//2.5
       

else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `fcname='${fcname}' and ccard=${cardno}`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2== 0){
    qr = `fcname='${fcname}' and date_register='${date1}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2!= 0){
    qr = `fcname='${fcname}' and date_register='${date2}'` 
}
//2.6

else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2== 0){
    qr = `ccard=${cardno} and date_register='${date1}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2!= 0){
    qr = `ccard=${cardno} and date_register='${date2}'` 
}
//2.7

else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `date_register between '${date1}' and '${date2}'` 
}

   
    //3
//3.1

else if(store != 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and id=${id} and cmobile=${mobileno}` 
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and id=${id} and paytype='${paytype}'`
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
      qr = `storeid=${store} and id=${id} and fcname='${fcname}'`   
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
      qr = `storeid=${store} and id=${id} and ccard=${cardno}`   
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2== 0){
      qr = `storeid=${store} and id=${id} and date_register='${date1}'`   
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2!= 0){
      qr = `storeid=${store} and id=${id} and date_register='${date2}'` 
}
//3.2


else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
    qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}'`
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
      qr = `id=${id} and cmobile=${mobileno} and fcname='${fcname}'`   
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
      qr = `id=${id} and cmobile=${mobileno} and ccard=${cardno}`   
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2== 0){
      qr = `id=${id} and cmobile=${mobileno} and date_register='${date1}'`   
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2!= 0){
      qr = `id=${id} and cmobile=${mobileno} and date_register='${date2}'` 
}
//3.3
else if(store != 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and cmobile=${mobileno} and paytype='${paytype}'`   
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and ccard=${cardno}`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
      qr = `cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}'`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
      qr = `cmobile=${mobileno} and paytype='${paytype}' and ccard=${cardno}`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2== 0){
      qr = `cmobile=${mobileno} and paytype='${paytype}' and date_register='${date1}'`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2!= 0){
      qr = `cmobile=${mobileno} and paytype='${paytype}' and date_register='${date2}'` 
}
//3.4
   
else if(store != 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
    qr = `storeid=${store}  and paytype='${paytype}' and fcname='${fcname}'`   
}
else if(store == 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
    qr = `id=${id} and paytype='${paytype}' and fcname='${fcname}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
  qr = `paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno}`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2== 0){
  qr = `paytype='${paytype}' and fcname='${fcname}' and date_register='${date1}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2!= 0){
  qr = `paytype='${paytype}' and fcname='${fcname}' and date_register='${date2}'` 
}

//3.5
   
else if(store != 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and fcname='${fcname}' and ccard=${cardno}`   
}
else if(store == 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `id=${id} and fcname='${fcname}' and ccard=${cardno}`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `cmobile=${mobileno} and fcname='${fcname}' and ccard=${cardno}`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2== 0){
qr = `fcname='${fcname}' and ccard=${cardno} and date_register='${date1}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2!= 0){
qr = `fcname='${fcname}' and ccard=${cardno} and date_register='${date2}'` 
}

//3.6
else if(store != 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and date_register between '${date1}' and '${date2}'`   
}
else if(store == 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and and date_register between '${date1}' and '${date2}'`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `cmobile=${mobileno} and date_register between '${date1}' and '${date2}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
qr = `paytype='${paytype}' and date_register between '${date1}' and '${date2}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
qr = `fcname='${fcname}' and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
qr = `ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}


//4    


//4.1

else if(store != 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and paytype='${paytype}'`
}
else if(store != 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
      qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and fcname='${fcname}'`   
}
else if(store != 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
      qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and ccard=${cardno}`   
}
else if(store != 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2== 0){
      qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and date_register='${date1}'`   
}
else if(store != 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2!= 0){
      qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and date_register='${date2}'` 
}

//4.2


else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
      qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}'`   
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
      qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and ccard=${cardno}`   
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2== 0){
      qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and date_register='${date1}'`   
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1== 0 && date2!= 0){
      qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and date_register='${date2}'` 
}
//4.3
else if(store != 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}'`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
      qr = `cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno}`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2== 0){
      qr = `cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}' and date_register='${date1}'`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2!= 0){
      qr = `cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}' and date_register='${date2}'` 
}
//4.4
   
else if(store != 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname} and ccard=${cardno}'`   
}
else if(store == 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
      qr = `id=${id} and paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno}`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2== 0){
  qr = `paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno} and date_register='${date1}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2!= 0){
  qr = `paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno} and date_register='${date2}'` 
}

//4.5
else if(store != 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and ccard=${cardno}  and date_register between '${date1}' and '${date2}'`   
}
else if(store == 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
      qr = `id=${id} and ccard=${cardno}  and date_register between '${date1}' and '${date2}'`   
}  
else if(store == 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `cmobile=${mobileno} and ccard=${cardno}  and date_register between '${date1}' and '${date2}'`   
}  
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `paytype='${paytype}' and ccard=${cardno}  and date_register between '${date1}' and '${date2}'`   
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
qr = `fcname='${fcname}' and ccard=${cardno}  and date_register between '${date1}' and '${date2}'` 
}
//4 mixup

else if(store != 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and id=${id} and paytype='${paytype}' and fcname='${fcname}'` 
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and id=${id} and paytype='${paytype}' and ccard=${cardno}` 
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and id=${id} and ccard=${cardno} and fcname='${fcname}'` 
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and id=${id} and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and cmobile=${mobileno} and fcname='${fcname}' and ccard=${cardno}` 
} 
else if(store != 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and cmobile=${mobileno} and paytype='${paytype}' and ccard=${cardno}` 
} 
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `id=${id} and cmobile=${mobileno} and fcname='${fcname}' and ccard=${cardno}` 
} 
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and cmobile=${mobileno} and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and paytype='${paytype}' and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and fcname='${fcname}' and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store}  and cmobile=${mobileno} and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store}  and paytype='${paytype}' and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store}  and fcname='${fcname}' and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `paytype='${paytype}'  and fcname='${fcname}' and date_register between '${date1}' and '${date2}'` 
}

//5

//5.1


else if(store != 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1== 0 && date2== 0){
      qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}'`   
}
else if(store != 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1== 0 && date2== 0){
      qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and paytype='${paytype}' and ccard=${cardno}`   
}
else if(store != 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
      qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and date_register between '${date1}' and '${date2}'`   
}
else if(store != 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and fcname='${fcname}' and ccard=${cardno}` 
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and id=${id} and paytype='${paytype}' and date_register between '${date1}' and '${date2}'`   
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and id=${id} and fcname='${fcname}' and date_register between '${date1}' and '${date2}'`   
}

else if(store != 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and id=${id} and ccard=${cardno} and date_register between '${date1}' and '${date2}'`   
}
//5.2


else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
      qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno}`   
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
      qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and date_register between '${date1}' and '${date2}'`   
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
      qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}' and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}
//5.3
else if(store != 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}'and ccard=${cardno}`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
      qr = `cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}'and date_register between '${date1}' and '${date2}'`   
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
      qr = `cmobile=${mobileno} and paytype='${paytype}' and ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}
//5.4
    
else if(store != 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
qr = `storeid=${store} and fcname='${fcname}' and ccard=${cardno}  and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and fcname='${fcname}' and ccard=${cardno}  and date_register between '${date1}' and '${date2}'` 
}  
else if(store == 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and cmobile=${mobileno} and ccard=${cardno}  and date_register between '${date1}' and '${date2}'` 
} 
else if(store == 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
qr = `paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno}  and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and fcname='${fcname}' and paytype='${paytype}'  and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and cmobile=${mobileno} and paytype='${paytype}'  and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id== 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and cmobile=${mobileno} and fcname='${fcname}'  and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and paytype='${paytype}' and ccard=${cardno}  and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
        qr = `id=${id} and fcname='${fcname}' and paytype='${paytype}'  and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and fcname='${fcname}' and cmobile=${mobileno}  and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and paytype='${paytype}'  and cmobile=${mobileno}  and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
        qr = `cmobile=${mobileno} and fcname='${fcname}' and paytype='${paytype}' and date_register between '${date1}' and '${date2}'` 
}


//6
else if(store != 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1== 0 && date2== 0){
    qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno}` 
}
else if(store == 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id== 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store}  and paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and paytype='${paytype}' and fcname='${fcname}' and ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and id=${id} and fcname='${fcname}' and ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and id=${id} and paytype='${paytype}' and ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id!= 0 && mobileno== 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and id=${id} and paytype='${paytype}' and fcname='${fcname}' and date_register between '${date1}' and '${date2}'` 
}
else if(store != 0 && id== 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `storeid=${store} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}' and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 && cardno== 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and fcname='${fcname}' and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname== 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and cmobile=${mobileno} and paytype='${paytype}' and ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}
else if(store == 0 && id!= 0 && mobileno!= 0 && paytype== 0 && fcname!= 0 && cardno!= 0 && date1!= 0 && date2!= 0){
    qr = `id=${id} and cmobile=${mobileno} and fcname='${fcname}' and ccard=${cardno} and date_register between '${date1}' and '${date2}'` 
}
    // else if(store != 0 && id!= 0 && mobileno!= 0 && paytype!= 0 ){
    //     qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and paytype=${paytype} `
    // }
    // else if(store != 0 && id!= 0 && mobileno!= 0 && paytype!= 0 && fcname!= 0 ){
    //     qr = `storeid=${store} and id=${id} and cmobile=${mobileno} and paytype=${paytype} and fcname=${fcname} `
    // }
    else {
        qr = `storeid=${store} or id=${id} or cmobile=${mobileno} or paytype='${paytype}' or fcname='${fcname}' or ccard=${cardno} or  date_register between '${date1}' and '${date2}'`
    
    }
    //qr = `storeid LIKE ${store} or id LIKE ${id} or cmobile LIKE ${mobileno} or paytype LIKE '${paytype}' or fcname LIKE '${fcname}' or ccard LIKE ${cardno} or  date_register between '${date1}' and '${date2}'`
    
    if(store == 0 && id== 0 && mobileno== 0 && paytype== 0 && fcname== 0 && cardno== 0 && date1== 0 && date2== 0){
        r = `select * from bill order by id`
    }
    else
     {r = `select * from bill where ` + qr}
    console.log("Query ", r)
    if((global.b)=='Filter'){
    pool.query(`${r}`, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            console.log(result)
            res.render("sell/sell", {
                data: result
            })
        }
    })}
    else{pool.query(`${r}`, function (err, result) {
        if (err) {
            console.log(err)
            req.json(err)
        } else {
            console.log(result)
           
            res.xls(`SearchFilterSoldView - ${(new Date()).toLocaleDateString()}.xlsx`, result);
        }
    })

    }
})



// Bill Product For Store
router.post('/billproductstore', (req, res) => {
    console.log(req.body)
    pool.query(`select * from billproduct where invoiceno = ?`, req.body.mbl, (err, result) => {
        if (err) {
            console.log(err);
            res.json({
                result: 'FAIL'
            })
        } else {
            console.log("New Sell ", result)

            res.json({
                result: result
            })

        }
    })
})
router.post('/billproductstore', (req, res) => {
    console.log(req.body)
    pool.query(`select * from sell where invoiceno = ?`, req.body.mbl, (err, result) => {
        if (err) {
            console.log(err);
            res.json({
                result: 'FAIL'
            })
        } else {
            console.log("New Sell ", result)

            res.json({
                result: result
            })

        }
    })
})







router.post('/create', (req, res) => {
    console.log(req.body)
    pool.query(`insert into gstper set ?`, req.body, (err, result) => {
        if (err) {
            console.log(err);
            res.send("False")
        } else {
            res.redirect("/sell")
        }
    })
})


router.get('/storeall1', (req, res) => {
   
    const queries = `select * from store `
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


router.get('/storeall', (req, res) => {
    console.log("Allllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll",req.query.st_id)
    var st_id=req.query.st_id
    const queries = `select * from store where id=${st_id}`
    pool.query(queries, (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json([]);
        } else {
            //console.log(result)
            res.status(200).json(result[0]);
        }
    })
});


module.exports = router;