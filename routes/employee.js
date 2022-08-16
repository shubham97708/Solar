const express = require('express');
const router = express.Router();
const pool = require('./pool');
const axios = require('axios');

const json2xls = require('json2xls');
router.use(json2xls.middleware);

var otpGenerator = require('otp-generator');



//Get All Emoloyee
router.get('/', (req, res) => {    
    pool.query(`Select * from employee`, (err, result) => {
        if(err){
            res.send('Invalid') 
        }
        else{
          console.log(result)
          res.render("employee/all", {data: result})
        }       
    })
})



// Edit All Employee 
router.get('/edit/:id', (req, res) => {
    const {
        id
    } = req.params;
    pool.query(`select * from employee where id = ?`, id, (err, result) => {
        if (err) throw err;
        else {
            res.render('employee/edit', {...result[0] })
        }
    })
})

//Delete Employee
router.get('/delete/:id', (req, res) => {
    const {
        id
    } = req.params;
    pool.query(`delete from employee where id = ?`, id, (err, result) => {
        if (err) throw err;
        else {
          pool.query(`Select * from employee`, (err, result1) => {
            if(err){
                res.send('Invalid') 
            }
            else{
              console.log(result)
              res.render("employee/all", {data: result1})
            }       
        })

        }
    })
})


router.post('/update', (req, res) => {
    pool.query(`update employee set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if (err) throw err;
        else {
          pool.query(`Select * from employee`, (err, result1) => {
            if(err){
                res.send('Invalid') 
            }
            else{
              console.log(result)
              res.render("employee/all", {data: result1})
            }       
        })
        }
    })
})










//pool.query(`SELECT T1.* ,(SELECT lat from store where id=T1.storeid) as storelat , (SELECT lng from store where id=T1.storeid) as storelng FROM emplogindetails T1 where empid = '${req.body.empid}' and  DATE(checkin_date)  BETWEEN '${req.body.checkin}' and '${req.body.checkout}'`, function(error,result){
 
//Show Performance Of All Employees
router.get('/ShowPerformance', (req, res) => {    


let result = {
  id: 0,
  empid: 0,
  imei: '',
  punch_date: '0000-00-00 00:00:00',
  punch_lat: '',
  punch_lng: '',
  price: 0,
  emname: '',
  emphone: '',
  total_price:0
}
res.render("employee/performance", {data: result})

  // pool.query(`Select T1.* , (SELECT name from employee where id=T1.empid) as emname , (SELECT phone from employee  where id=T1.empid) as emphone from empsold T1  `, (err, result) => {
  //     if(err){
  //         res.send('Invalid') 
  //         console.log(err)
  //     }
  //     else{
  //       console.log(result)
  //       res.render("employee/performance", {data: result})
  //     }       
  // })
})



router.get('/ShowLoginDetails', (req, res) => {    
 // pool.query(`SELECT T1.* ,(SELECT lat from store where id=T1.storeid) as storelat , (SELECT lng from store where id=T1.storeid) as storelng , (SELECT name from employee where id=T1.empid) as empname FROM emplogindetails T1 where empid = '${req.body.empid}' and  DATE(checkin_date)  BETWEEN '${req.body.checkin}' and '${req.body.checkout}'`, function(error,result){


let result={
  storeid: 0,
  checkin_date: '0000-00-00 00:00:00',
  checkout_date: '0000-00-00 00:00:00',
  checkin_lat: '',
  checkout_lat: '',
  checkin_lng: '',
  checkout_lng: '',
  status: '',
  storename: '',
  storelat: '',
  storelng: '',
  empname: ''
}


res.render("employee/logindetail", {data: result,date1:0,date2:0})


// pool.query(`SELECT T1.* ,(SELECT name from store where id=T1.storeid) as storename , (SELECT lat from store where id=T1.storeid) as storelat , (SELECT lng from store where id=T1.storeid) as storelng , (SELECT name from employee where id=T1.empid) as empname FROM emplogindetails T1`, function(error,result){
//   if(error){
//     res.send('Invalid') 
//     console.log(err)
// }
// else{
//   console.log(result)
//   res.render("employee/logindetail", {data: result})
// } 
// })


})


router.post('/loginsearchfilter', (req, res) => {    
  console.log(req.body) 



  if(req.body.btn=="Filter"){



 pool.query(`SELECT T1.* , (SELECT name from store where id=T1.storeid) as storename , (SELECT lat from store where id=T1.storeid) as storelat , (SELECT lng from store where id=T1.storeid) as storelng , (SELECT name from employee where id='${req.body.employee}') as empname FROM emplogindetails T1 where empid = '${req.body.employee}' and checkin_date between '${req.body.date1}' and '${req.body.date2}'`, function(error,result){
   if(error){
     res.send('Invalid') 
     console.log(error)
 }
 else{
   console.log(result)
   res.render("employee/logindetail", {data: result,date1:req.body.date1,date2:req.body.date2 })
      } 
    })

  }else if(req.body.btn=="Download"){


 pool.query(`SELECT  (SELECT name from employee where id='${req.body.employee}') as Name , (SELECT name from store where id=T1.storeid) as Store_Name , T1.checkin_date as IN_Date_Time , T1.addressin as IN_Address , T1.checkout_date as EXIT_Date_Time ,  T1.addressout as EXIT_Address  FROM emplogindetails T1 where empid = '${req.body.employee}' and checkin_date between '${req.body.date1}' and '${req.body.date2}'`, function(error,result){
   if(error){
     res.send('Invalid') 
     console.log(error)
 }
 else{
   console.log(result)
   res.xls(`Employee-Login's - ${(new Date()).toLocaleDateString()}.xlsx`, result);
      } 
    })





  }






 })



// Show Total Bill Of perticular customer
// router.get('/custotalbill/:mbl', (req, res) => {
//     const {
//       mbl
//     } = req.params;
//     console.log(req.params.id)
//     if (req.session.adminId) {
//       pool.query(`Select * from bill  where cmobile = ?`, req.params.mbl, (err, result) => {
//         console.log(result)
//         //res.render("customer/customeradmin",{data:result})
//         res.render("customer/customertotalbill", {
//           data: result
//         })
//       })
  
//     } else {
//       res.send('Invalid')
//     }
//   })








// Employee Login And Checks
router.post('/LoginEmployee', function(req, res, next) {
    console.log(req.body)
    
                            pool.query("select * from employee  where phone = ? and password = ?  " , [req.body.phone, req.body.password] , function(err,result2){
                                if(err){
                                    console.log(err)
                                    return res.status(500).json({'result':false})
                                }
                                else{
                                    
                                if(result2.length>0){
                                    if(result2[0].status=='True'){
                                        return res.status(200).json({'result':result2,'msg':'','status':true})
                                    }else if(result2[0].status=='False'){    
                                    return res.status(200).json({'result':result2,'msg':'Profile Has Been Declined','status':false})
                                   }else if(result2[0].status=='Pending'){
                                    return res.status(200).json({'result':result2,'msg':'Profile Waiting For Approval','status':false})
                                   }
                                }else{
                                    return res.status(200).json({'result':result2,'msg':'ID And Password Incorrect','status':false}) 
                                }
                            }
         })     
});




// Employee Signup
router.post('/SignUpEmployee', function(req, res, next) {
    console.log(req.body)
    var otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
      alphabets:false
      
  })
  const bdy ={
      otps:otp,
      mbl:req.body.phone,
  }

    pool.query("insert into employee (name,phone,email,password,status,otp) values(?,?,?,?,?,?)",[req.body.fullname,req.body.phone,req.body.email,req.body.password,"True",otp],function(err,result){
        if(err){
            console.log(err)
            return res.status(200).json({'result':false,'msg':'There Is an Error With Server','status':false})
        }
        else{
            console.log("My Result---",result.insertId)
            if(result.insertId){
            return res.status(200).json({'result':result,'msg':`Account succefully Created Your Employee ID IS  ${result.insertId} And Please Take ScreenShot Send It To [Office]`,'status':true})
              }else{
            return res.status(200).json({'result':false,'msg':'There Is an Error To Create This Account','status':false})
              }

          ///  console.log(result)
  
          //   axios.post(`${process.env.BaseUrl}/api/sendotp`,bdy)
          //   .then(function (response) {
          //   //   console.log(response);
          //    return res.status(200).json({'result':true})
          //   })
          //   .catch(function (error) {
          //    // console.log(error);
          //    return res.status(500).json({'result':false})
          //   });
  
  
         //   return res.status(200).json({'result':true})
        }
    })    
});
  

// OTP match register Time
  router.post('/SignUpEmployeeOtp', function(req, res, next) {
    console.log(req.body)
    pool.query("update employee set status = ? where otp = ? and phone = ?",["True",req.body.otp,req.body.phone],function(err,result){
        if(err){
            console.log(err)
            return res.status(500).json({'result':false})
        }
        else{
            console.log(result)
            return res.status(200).json({'result':true})
        }
    })
});




// Forget Password
router.post('/CheckMobile', function(req, res, next) {
    console.log(req.body)
    pool.query("select * from employee  where phone = ? and status = ? " , [req.body.phone,"True"], function(err,result){
        if(err){
            console.log(err)
            return res.status(500).json({'result':false})
        }
        else{
          console.log(result)

              var otp = otpGenerator.generate(6, {
                                                upperCase: false,
                                                specialChars: false,
                                                alphabets:false
                                                
                                           })
                const bdy ={
                    otps:otp,
                    mbl:req.body.phone,
                }
                  console.log(bdy)
                pool.query("update employee set otp=? where phone=?" , [otp,req.body.phone], function(err,results){
  
                  if(err){
                      console.log(err)
                      return res.status(500).json({'result':false})
                  }
                  else{
  
                      // console.log("data",process.env.BASE_URL)
                      if(results.changedRows){
                                //yha update ke baad jo responce aa raha
                      axios.post(`${process.env.BaseUrl}/api/sendotp`,bdy)
                      .then(function (response) {
                      //   console.log(response);
                       return res.status(200).json({'result':true})
                      })
                      .catch(function (error) {
                       // console.log(error);
                       return res.status(500).json({'result':false})
                      });
  
                       // return res.status(200).json({'result':true})
                      }else{
                          return res.status(500).json({'result':false}) 
                      }
                  }
                })
        }
    })  
});


// Update Password
router.post('/UpdatePasswordEmployee', function(req, res, next) {
    console.log(req.body)
    pool.query("update employee set password=? where otp=?" , [req.body.password, req.body.otp], function(err,result){
        if(err){
            console.log(err)
            return res.status(500).json({'result':false})
        }
        else{
            console.log(result)
            if(result.changedRows){
            return res.status(200).json({'result':true})
            }else{
            return res.status(500).json({'result':false})  
            }
        }
    })  
});


//Get All Store In Dropdown
router.get('/getallstore', (req, res) => {    
      pool.query(`Select id as value ,name as label from store `, (err, result) => {
          if(err){
            return res.status(500).json({'result':false})  
          }
          else{
            console.log(result)
            return res.status(200).json({'result':result})  
          }       
      })
})


// Check In Attendance
router.post('/Checkin', function(req, res, next) {
    console.log(req.body)


    pool.query(`SELECT * FROM emplogindetails  where  DATE(checkin_date) = '${req.body.comapredate}' and empid = ${req.body.empid} `, function(error,result){
    
      if(error)
      { console.log(error)
         return res.status(500).json({'result':false ,'msg':"There Is An Error In Server"})
      }
      else
     { 

      if(result.length == 0){

        pool.query("insert into emplogindetails (empid,storeid,checkin_date,checkin_lat,checkin_lng,status,addressin) values (?,?,?,?,?,?,?)",[req.body.empid,req.body.storeid,req.body.checkin_date,req.body.checkin_lat,req.body.checkin_lng,req.body.status,req.body.addressin], function(err,result1){
            if(err){
                       console.log(err)
                       return res.status(500).json({'result':false ,'msg':"There Is An Error In Server"})
                    }
            else{
                    console.log(result) 
                  if(result1.insertId){
                          return res.status(200).json({'result':true,'msg':"Successfully In"})
                                      }else{
                          return res.status(500).json({'result':false,'msg':'oops ! Please Try Again....'})  
                            }
                  }
               })
           }else{
            return res.status(500).json({'result':false ,'msg':"Today You Do Not Have Chance To Signed In"})   
           }


          }

        });



});





// Check Button Status For App
router.post('/buttonStatus', function(req, res, next) {
 
    console.log("Post View Data ...............",req.body)
  
     pool.query(`SELECT * FROM emplogindetails  where  DATE(checkin_date) = '${req.body.checkin_date}' and empid = ${req.body.empid} and status = '${req.body.status}' `, function(error,result){
    
     if(error)
     { console.log(error)
        return res.status(500).json({'result':false})
     }
     else
    { 
        console.log("Button DATA -------",result , result.length)

        if(result.length > 0){
            console.log("My Data Is Passed")
                                 return res.status(200).json({'result':result})
        }else{
            console.log("My Data Is Fail")
                                 return res.status(200).json({'result':false})    
        }
     }
   })
});





// Logout Out 
router.post('/logout', function(req, res, next) {
  console.log(req.body) 
    console.log("Post LogOUT Data  ...............",req.body)
            pool.query(`update emplogindetails set checkout_date = ? ,checkout_lat = ? ,checkout_lng = ? , status = ? , addressout = ? where DATE(checkin_date) = '${req.body.comapredate}' and empid = ${req.body.empid} and status = '${req.body.status}'`,[req.body.checkout_date, req.body.checkout_lat,req.body.checkout_lng,"DeActivate",req.body.addressout],function(err,result1){

                if(err){
                    return res.status(500).json({'result':false}) 
                }else{

                  console.log(result1)
                    if(result1.changedRows){
                    return res.status(200).json({'result':true})
                        }else{
                    return res.status(500).json({'result':false})  
            }
        }
    })
});





// Punch Sold By Employee
router.post('/Punch', function(req, res, next) {
        console.log(req.body)
       
    
            pool.query("insert into empsold (empid,imei,punch_date,punch_lat,punch_lng,price) values (?,?,?,?,?,?)",[req.body.empid,req.body.imei,req.body.punch_date,req.body.punch_lat,req.body.punch_lng,req.body.price], function(err,result){
                if(err){
                        console.log("Errrrrrrrrrrr",err)
                        if(err.code=="ER_DUP_ENTRY"){
                          return res.status(500).json({'result':false,'msg':`ERROR Duplicate Entry  ${req.body.imei}`})
                        }else{
                          return res.status(500).json({'result':false,'msg':"There Is an Error In Server"})
                      }
                   }
                else{
                        console.log(result.code) 
                if(result.insertId){
                return res.status(200).json({'result':true,})
                }else{
                return res.status(500).json({'result':false,'msg':"Something Went Wrong"})  
                }
            }
        })
});
    


// Employee Stock Categories
router.get("/categories", (req, res) => {
    const allCategories = `select * from categories`;
    pool.query(allCategories, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json([]);
      } else {
        res.status(200).json(result);
      }
    })
  });

//Emplotee Stock Brands
router.get("/brands/:categoryid", (req, res) => {
    const {
      categoryid
    } = req.params;
    const brandsWithStock = `select * from brand where id in (select distinct brandid from feedstock where storeid != 0) 
      and categoryid = ${categoryid};`;
    pool.query(brandsWithStock, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json([]);
      } else {
        res.status(200).json(result);
      }
    });
  });




//Employee Stock color
router.get("/color/:modelid", (req, res) => {
    const {
      modelid,
    
    } = req.params;
    // (select count(id) from feedstock where modelid = f.modelid and storeid != 0 and storeid != f.storeid and color = f.color) as count 
    const query = `SELECT f.color, count(id) as count FROM feedstock f where f.modelid = ? and f.storeid != 0 group by f.color;`
    pool.query(query, [modelid], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json([]);
      } else {
        res.status(200).json(result);
      }
    });
});
  

//Employee Stock Model
router.get("/model/:id", (req, res) => {
    const {
      id,
    } = req.params;
    const query = `select m.id, m.brandid, m.name, m.modelno, (select count(id) from feedstock where modelid = m.id and storeid != 0) as count from model m where m.brandid = ?;`
    pool.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json([]);
      } else {
        res.status(200).json(result);
      }
    });
  });




//Employee Store 
router.get("/store/:modelid/:color", (req, res) => {
    const {
      modelid,
      color,
      storeid
    } = req.params;
    // (select count(id) from feedstock where modelid = f.modelid and storeid != 0 and storeid != ? and color = f.color) as count,
    const query = `SELECT f.color, count(id) as count, (select name from store where id = f.storeid) as storename, f.storeid, f.modelid
      FROM feedstock f where f.modelid = ? and  f.color = ? and f.storeid != 0 group by f.storeid;`
    pool.query(query, [modelid, color], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json([]);
      } else {
        res.status(200).json(result);
      }
    });
  });



//Employee Stock
router.get("/stock/:storeid/:modelid/:color", (req, res) => {
    const {
      storeid,
      modelid,
      color
    } = req.params;
    const queries = `select count(id) as stock from feedstock where modelid = ? and storeid = ? and color = ?;select * from feedstock where modelid = ? and storeid = ?;select * from store where id = ?;`;
    pool.query(
      queries,
      [modelid, storeid, color, modelid, storeid, storeid],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json([]);
        } else {
          res.status(200).json(result);
        }
      }
    );
  });




// Check Performance Employee
router.post('/Performance', function(req, res, next) {
  console.log(req.body)
  pool.query(`SELECT *, (select SUM(price) from empsold WHERE   empid = '${req.body.empid}' and  punch_date  between  '${req.body.checkin}' and '${req.body.checkout}') as totalprice FROM empsold   WHERE   empid = '${req.body.empid}' and  punch_date  between  '${req.body.checkin}' and '${req.body.checkout}' `, function(error,result){
      if(error){
          console.log(error)
          return res.status(500).json({'result':false}) 
      }
      else{
          console.log("Result Length For Login",result)
                 if(result.length!=0){
                       return res.status(200).json({'result':result}) 
                                     }
                 else{
                        return res.status(500).json({'result':false})  
                     }
          }
    })
});




// Check Performance Employee
router.post('/Imeiperformance', function(req, res, next) {
  console.log(req.body)
  pool.query(`SELECT *  FROM empsold   WHERE   imei = '${req.body.imei}' and empid = '${req.body.empid}'`, function(error,result){
      if(error){
          console.log(error)
          return res.status(500).json({'result':false}) 
      }
      else{
          console.log("Result Length For Login",result)
                 if(result.length!=0){
                       return res.status(200).json({'result':result}) 
                                     }
                 else{
                        return res.status(500).json({'result':false})  
                     }
          }
    })
});




// Check Punctuality
router.post('/punctuality', function(req, res, next) {
  console.log(req.body)
  pool.query(`SELECT T1.* ,(SELECT lat from store where id=T1.storeid) as storelat , (SELECT lng from store where id=T1.storeid) as storelng FROM emplogindetails T1 where empid = '${req.body.empid}' and  DATE(checkin_date)  BETWEEN '${req.body.checkin}' and '${req.body.checkout}'`, function(error,result){
      if(error){
          console.log(error)
          return res.status(500).json({'result':false}) 
      }
      else{
          console.log("Result Length For Login",result)

                 if(result.length!=0){
                  return res.status(200).json({'result':result})                
                }
                 else{
                        return res.status(500).json({'result':false})  
                    }
          }
    })
});



// Show Transfer Status
router.get("/transferstatus", (req, res) => {
 // const brandsWithStock = `select * from transferbymanager where  order by date desc`;

let result = {
    id: 0,
    senderid: 0,
    receiverid: 0,
    imeino: '',
    person: '',
    status: '',
    date: '0000-00-00 00:00:00',
    senderfirm: '',
    recieverfirm: ''
}

res.render("transfers/bymanager", {data: result})

  // pool.query(`select T1.*,(select name from store where id =T1.senderid) as senderfirm , (select name from store where id =T1.receiverid) as recieverfirm  from transferbymanager T1 `, (err, result) => {
  //   if (err) {
  //     console.log(err);
  //     res.send("Invalid")
  //   } else {
  //     console.log(result)
  //     res.render("transfers/bymanager", {data: result})
  //   }
  // });
});



router.post("/transferstatussearchfilter", (req, res) => { 

let query = ''

if(req.body.imei != ''){
  query = `select T1.*,(select name from store where id =T1.senderid) as senderfirm , (select name from store where id =T1.receiverid) as recieverfirm  from transferbymanager T1 where imeino ='${req.body.imei}' `
}else if(req.body.date1 != '' && req.body.date2 != ''){
  query =`select T1.*,(select name from store where id =T1.senderid) as senderfirm , (select name from store where id =T1.receiverid) as recieverfirm  from transferbymanager T1 where date between '${req.body.date1}' and '${req.body.date2}' `
}else if(req.body.date1 != '' && req.body.date2 != '' && req.body.imei != ''){
  query = `select T1.*,(select name from store where id =T1.senderid) as senderfirm , (select name from store where id =T1.receiverid) as recieverfirm  from transferbymanager T1 where imeino  = '${req.body.imei}' and date between '${req.body.date1}' and '${req.body.date2}'  `
}

console.log("transferstatussearchfilter", req.body )

//pool.query(`select T1.*,(select name from store where id =T1.senderid) as senderfirm , (select name from store where id =T1.receiverid) as recieverfirm  from transferbymanager T1 `, (err, result) => {
  
pool.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.send("Invalid")
    } else {
      console.log(result)
      res.render("transfers/bymanager", {data: result})
    }
  });
})



router.post('/performancesearchfilter', (req, res) => {

  console.log(req.body)

if(req.body.btn=="Filter"){
  pool.query(`Select T1.* ,(select SUM(price) from empsold where empid = '${req.body.employee}' and punch_date between '${req.body.date1}' and '${req.body.date2}') as total_price ,  (SELECT name from employee where id='${req.body.employee}') as emname , (SELECT phone from employee  where id='${req.body.employee}') as emphone   from empsold T1 where  empid = '${req.body.employee}' and punch_date between '${req.body.date1}' and '${req.body.date2}' `, (err, result) => {
    if(err){
        res.send('Invalid') 
        console.log(err)
    }
    else{
      console.log(result)
      res.render("employee/performance", {data: result})
    }       
})

}else if(req.body.btn=="Download"){    
  
  pool.query(`Select   (SELECT name from employee where id='${req.body.employee}') as Name , (SELECT phone from employee  where id='${req.body.employee}') as Number,T1.punch_date as Date, T1.imei as IMEI , T1.price as Price ,(select SUM(price) from empsold where empid = '${req.body.employee}' and punch_date between '${req.body.date1}' and '${req.body.date2}') as Total_Price     from empsold T1 where  empid = '${req.body.employee}' and punch_date between '${req.body.date1}' and '${req.body.date2}' `, (err, result) => {
    if(err){
        res.send('Invalid') 
        console.log(err)
    }
    else{
      console.log(result)
      res.xls(`Employee-Performance - ${(new Date()).toLocaleDateString()}.xlsx`, result);
    }       
  })
}
})



// DROP DOWN SHOW ALL EMPLOYEE
router.get('/employeeall', (req, res) => {
  const queries = `select * from employee`
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





module.exports = router;  