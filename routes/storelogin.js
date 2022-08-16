const express = require('express');
const router = express.Router();
const pool = require('./pool');
var otpGenerator = require('otp-generator');
var localStorage = require('localStorage');
//var request = require('request');
const axios = require('axios');


const tableName = 'admin'

router.get('/', (req, res) => {
  if (req.session.storeId) {
    res.redirect('/storelogin/home')
  } else {
    res.render('storelogin/storelogin', {
      msg: "Please Login"
    })
  }
});



router.get('/bill', (req, res) => {

  res.render('storelogin/billprint');
});



router.get('/home', (req, res) => {
  if (req.session.storeId) {
    res.render('storelogin/storehome', req.session)

  } else {
    res.render('storelogin/storelogin', {
      msg: "Please Login"
    })
  }
})

router.post('/checkLogin', (req, res) => {
  const {
    id,
    password
  } = req.body;
  console.log(req.body)
  var sql = pool.query(`select * from store where username = ? and password = ?`, [id, password], (err, result) => {

    if (err) throw err;
    else if (result.length) {

      req.session.storeId = result[0].id;
      req.session.storeName = result[0].name;
      req.session.wholedata = result
      res.redirect('/storelogin/home')
    } else {
      console.log(result)
      res.render('storelogin/storelogin', {
        msg: "Wrong Credentials"
      })
    }
  })
  console.log(sql)
})


router.get('/logout', (req, res) => {
  req.session.storeId = null;
  req.session.storeName = null;
  req.session.wholedata = null;
  res.redirect('/')
});


router.get('/showbillform', (req, res) => {

  res.render('storelogin/showbillform', {
    data: req.session.wholedata
  });

})

router.post("/getmobile", (req, res) => {

  console.log(req.body)

  pool.query(`select * from feedstock where imeino=?`, [req.body.imeimob], (er, re) => {
    if (er) {

      res.status(500).json({
        RESULT: false
      });
    } else {
      console.log(re.length);
      if (re.length == 0) // Not Found IMEI NO. In Table condition 1
      {
        // res.status(200).json({RESULT:false});
        res.status(200).json({
          feedstock: [{
            storeid: null,
            storename: null
          }]
        });

        console.log(re, "Mobile Not Found")
      } else {
        if (re[0].storeid == 0) //Mobile IS Sold condition 2
        {
          res.status(200).json({
            feedstock: [{
              storeid: 0,
              storename: "SOLD"
            }]
          });
          console.log("SOLD")
        } else if (re[0].storeid == req.body.storeid) //Contidition True
        {
          pool.query(`select * from model where id=?`, [re[0].modelid], (er, rmodel) => {
            pool.query(`select * from brand where id=?`, [rmodel[0].brandid], (er, rbrand) => {
              pool.query(`select * from categories where id=?`, [rbrand[0].categoryid], (er, rcategory) => {
                res.status(200).json({
                  feedstock: re,
                  model: rmodel,
                  brand: rbrand,
                  categories: rcategory
                });
                console.log("Feedstock ", re)
                console.log("Model ", rmodel)
                console.log("Brand ", rbrand)
                console.log("Categories ", rcategory)
              })
            })
          })
        } else if (re[0].storeid != req.body.storeid) // Mobile Is Not Present at your Store Contition 3
        {
          res.status(200).json({
            feedstock: [{
              storeid: null,
              storename: re[0].storename
            }]
          });

          console.log("Currently Mobile Is Not Present At your Store \n", re[0].storename);
        }
        // res.status(200).json({RESULT:re});
        // console.log(re[0].storename)
      }
    }

  })


});






router.post("/getcustcard", (req, res) => {
  console.log(req.body)
  pool.query(`select * from customer where ccard=?`, [req.body.ccard], (er, re) => {
    if (er) {
      console.log(er)
      res.status(500).json("Server Error");
    } else {
      if (re == "") {
        console.log("Customer Not Exist")
        res.status(200).json("Customer Not Exist");
      } else {
        console.log(re)
        res.status(200).json(re);
      }
    }
  })
})




router.post("/getcustomer", (req, res) => {
  console.log(req.body)
  pool.query(`select * from customer where mobile=?`, [req.body.cmob], (er, re) => {
    if (er) {
      console.log(er)
      res.status(500).json("Server Error");
    } else {
      if (re == "") {
        console.log("Customer Not Exist")
        res.status(200).json("Customer Not Exist");
      } else {
        console.log(re)
        res.status(200).json(re);
      }
    }

  })

})

// Resend  Button Click  Send OTP
router.post("/resendotp", (req, res) => {

  console.log("%%%%%%%%%%ok", req.body)
  var otp = otpGenerator.generate(6, {
    upperCase: false,
    alphabets: false,
    specialChars: false
  });
  localStorage.setItem("otp", otp);
  body = localStorage.getitem("body");
  let bdy = {
    mbl: body.cmobile,
    otps: otp
  }
  axios.post(`${process.env.BASE_URL}/api/sendotp`, bdy)
    .then(function (response) {
      res.status(200).json("ok");
       res.render("storelogin/otpwindow",{msg:"OTP has Been Sent Succefully"})
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
})






// OTP Match -Client Existing Custumer
router.post("/otpwindow", (req, res) => {
  var priceforfn=0
  var a = localStorage.getItem("otp");
  var invc = localStorage.getItem("invc")
  const boddy = JSON.parse(localStorage.getItem("body"))
  const customer = JSON.parse(localStorage.getItem("customer"))
  const scheme = JSON.parse(localStorage.getItem("scheme"))
  let data = [];
  let solddata = [];
  //console.log("SPECIAL BODY",boddy);
  //console.log("SPECIAL CUSTOMER",customer);
  //console.log("SPECIAL SCHEME",scheme);
  //console.log("Scheme Point ",scheme[0].point) 
  //console.log("Scheme Gadget ",scheme[0].gadget) 
  console.log("singleeeeeeee  ", scheme[0].discount);

  console.log("multipleeeeeeeee ", scheme)
  if (a == req.body.otp) {
    pool.query(`update customer set custype = ? , point = ? , gadget = ?, discount = ? where   mobile = ?`, ["existing", scheme[0].point, scheme[0].gadget, scheme[0].discount, customer[0].mobile], (err, result) => {
      if (err) {
        console.log("sorryyy")
      } else {
        pool.query(`select * from customer where mobile=?`, [boddy.cmobile], (cerror, ctable) => {

          pool.query(`insert into bill (storeid,storename,storeaddress,storegstno,cmobile,cname,cadd,cgstno,ccard,paytype,fcname,pbonuspoint,custype,cbonuspoint,gadget,discount,downpayment,storemobile)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [boddy.storeid, boddy.storename, boddy.storeaddress, boddy.storegstno, boddy.cmobile, boddy.cname, boddy.cadd, boddy.cgstno, boddy.ccard, boddy.paytype, boddy.fcname, customer[0].point, "existing", scheme[0].point, scheme[0].gadget, scheme[0].discount,boddy.test,boddy.storemobile], (err, result) => {
            if (err) {
              console.log(err)
            } else {
              console.log(result.insertId)

             

              for (let i = 1; i <= parseInt(boddy.totalrows); i++) {
                data[i - 1] = [result.insertId, boddy[`ptype${i}`], boddy[`brandname${i}`], boddy[`brandid${i}`], boddy[`modelname${i}`], boddy[`modelid${i}`], boddy[`categoriesid${i}`], boddy[`modelno${i}`], boddy[`color${i}`], boddy[`hsnmobile${i}`], boddy[`price${i}`], boddy[`qty${i}`], boddy[`imeimob${i}`], boddy[`gstpercent${i}`]];
                // solddata[i-1] =[parseInt(boddy.storeid),boddy[`imeimob${i}`]]  
                priceforfn = priceforfn +parseInt( boddy[`price${i}`])     
              }
              //console.log("$$$$$$$$$$$$$$$$ ",solddata)
              var a = `insert into billproduct(invoiceno, ptype, brandname, brandid, modelname,modelid,categoriesid,modelno,color,hsnmobile,price,qty,imeimob,gstpercent) values ${data}`
              console.log(a)
              pool.query(`insert into billproduct(invoiceno, ptype, brandname, brandid, modelname,modelid,categoriesid,modelno,color,hsnmobile,price,qty,imeimob,gstpercent) values ?`, [data], (errs, resul) => {
                if (err) {
                  console.log(err);

                } else {
                  pool.query(`Select * from  billproduct where invoiceno = ?`, [result.insertId], (serror, rschemee) => {






                    for (let i = 1; i <= parseInt(boddy.totalrows); i++) {
                      const queryz = `update feedstock set storeid = 0, storename = 'Sold' where imeino = ? and storeid = ?`;
                      console.log(queryz);
                      pool.query(queryz, [boddy[`imeimob${i}`], parseInt(boddy.storeid)], (err, resultkl) => {
                        if (err) {
                          console.log("feedstock error $$ ", err);
                          // res.json(false);
                        } else {
                          const transferQueryz = `insert into sold (storeid, imeino, date) values (?,?, CURRENT_DATE())`;
                          pool.query(transferQueryz, [parseInt(boddy.storeid), boddy[`imeimob${i}`]], err => {
                            if (err) {
                              console.log("Transfer  error $$ ", );
                              //res.json(false);
                            } else {
                              // res.json("sold");
                              //res.render("storelogin/billprint",{data:rschemee,body:req.body,customer:ctable,scheme:rscheme,invoice:parseInt(result.insertId),prevpoint:0})


                            }
                          });
                        }
                      });
                    }
                   // var financeamount = priceforfn -  (rscheme[0].discount + req.body.test) 
                      var a=0
                   if(boddy.test==''){
                     console.log("***************************")
                   }
                else{console.log("++++++++++++++++++++++++++")
                      a=boddy.test
                      }
                    var financeamount = (parseInt(priceforfn) - (parseInt(scheme[0].discount) + parseInt(a)  + parseInt(customer[0].point)))
                    console.log("My Finance Ammount ",financeamount)
                    
                    console.log("My Finance priceforfn ",priceforfn )
                    console.log("My Finance discount ",scheme[0].discount)
                    console.log("My Finance dp ",boddy.test )
                    console.log("My Finance point ",customer[0].point)

                    pool.query(`update bill set financeamount = ? where id = ?`, [financeamount,result.insertId], (financeerror, financeresult) => { 
                      if(financeerror){
                        console.log(financeerror)
                      }else{
                    
                    // res.render("storelogin/shw",{data:rschemee})
                    res.render("storelogin/billprint", {
                      data: rschemee,
                      body: boddy,
                      customer: ctable,
                      scheme: scheme,
                      invoice: parseInt(result.insertId),
                      prevpoint: customer[0].point
                    })
                  }
                })
                  }) //                       
                } //
              }); //        
            } //                                                                
          })








        }) //2
      } //1
    }) //1

  } else {
    res.render("storelogin/otpwindow", {
      msg: "You enter Invalid OTP",
      otpmsg: a,
      mob: body.cmobile
    })
  }
})


router.post("/solds", (req, res) => {


  const query = `update feedstock set storeid = 0, storename = 'Sold' where imeino = ? and storeid = ?;`;
  pool.query(query, [solddata], (err, result) => {
    if (err) {
      console.log(err);
      // res.json(false);
    } else {
      const transferQuery = `insert into sold (storeid, imeino, date) values (?,?, CURRENT_DATE())`;
      pool.query(transferQuery, [solddata], err => {
        if (err) {
          console.log(err);
          //res.json(false);
        } else {
          res.json("sold");
        }
      });
    }
  });
})



router.post("/updatedownpayment", (req, res) => {

  pool.query(`update bill set financeamount = ? where id = ?`, [req.body.financeamount,req.body.id], (error, result) => {
    if(error){
      res.status(500).json(false);
    }else{
      res.status(200).json(true);
    }
  })
})



//var priceforfntax=0




 router.post("/sold", (req, res)  =>  {
  var priceforfn=0
  const {
    totalrows
  } = req.body;
  const queryi = `insert into billproduct(invoiceno, ptype, brandname, brandid, modelname,modelid,categoriesid,modelno,color,hsnmobile,price,qty,imeimob,gstpercent) values ?`

  let data = [];
  let solddata = [];
  console.log(req.body)
  pool.query(`select * from customer where mobile=?`, [req.body.cmobile], (cerror, ctable) => {
    // pool.query(`insert into bill set ?`, req.body, (err, result) => {
    if (cerror) {
      res.status(500).json(cerror);
    } else {
      if (ctable == "") { //NON Existing Customer
        pool.query(`Select * from  brand where id = ? `, parseInt(req.body.brandid1), (serror, rscheme) => {
          //console.log("best of best ",rscheme)
          pool.query('insert into customer(name,mobile,address,point,gadget,cgstno,ccard,custype,discount)values(?,?,?,?,?,?,?,?,?)', [req.body.cname, req.body.cmobile, req.body.cadd, rscheme[0].point, rscheme[0].gadget, req.body.cgstno, req.body.ccard, "new", rscheme[0].discount], function (error, result) {
            pool.query(`select * from customer where mobile=?`, [req.body.cmobile], (cerror, ctable) => {

              pool.query(`insert into bill (storeid,storename,storeaddress,storegstno,cmobile,cname,cadd,cgstno,ccard,paytype,fcname,pbonuspoint,custype,cbonuspoint,gadget,discount,downpayment,storemobile)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [req.body.storeid, req.body.storename, req.body.storeaddress, req.body.storegstno, req.body.cmobile, req.body.cname, req.body.cadd, req.body.cgstno, req.body.ccard, req.body.paytype, req.body.fcname, 0, "new,", rscheme[0].point, rscheme[0].gadget, rscheme[0].discount,req.body.test,req.body.storemobile], (err, result) => {
                if (err) {
                  console.log(err)
                } else {
                  console.log(result.insertId)
                  

                  for (let i = 1; i <= parseInt(totalrows); i++) {
                    data[i - 1] = [result.insertId, req.body[`ptype${i}`], req.body[`brandname${i}`], req.body[`brandid${i}`], req.body[`modelname${i}`], req.body[`modelid${i}`], req.body[`categoriesid${i}`], req.body[`modelno${i}`], req.body[`color${i}`], req.body[`hsnmobile${i}`], req.body[`price${i}`], req.body[`qty${i}`], req.body[`imeimob${i}`], req.body[`gstpercent${i}`]];
                    solddata[i - 1] = [parseInt(req.body.storeid), req.body[`imeimob${i}`]]

                    priceforfn= priceforfn + req.body[`price${i}`]
                   // priceforfntax  = priceforfntax + req.body[`price${i}`] /((req.body[`gstpercent${i}`]/100)+1)
                  }

                  console.log(solddata)

                  pool.query(queryi, [data], (errs, resul) => {
                    if (err) {
                      console.log(err);

                    } else {
                      pool.query(`Select * from  billproduct where invoiceno = ?`, [result.insertId], (serror, rschemee) => {

                        // res.render("storelogin/shw",{data:rschemee})






                        for (let i = 1; i <= parseInt(totalrows); i++) {
                          const queryz = `update feedstock set storeid = 0, storename = 'Sold' where imeino = ? and storeid = ?`;
                          console.log(queryz);
                          pool.query(queryz, [req.body[`imeimob${i}`], parseInt(req.body.storeid)], (err, resultkl) => {
                            if (err) {
                              console.log("feedstock error $$ ", err);
                              // res.json(false);
                            } else {
                              const transferQueryz = `insert into sold (storeid, imeino, date) values (?,?, CURRENT_DATE())`;
                              pool.query(transferQueryz, [parseInt(req.body.storeid), req.body[`imeimob${i}`]], err => {
                                if (err) {
                                  console.log("Transfer  error $$ ", );
                                  //res.json(false);
                                 } else {
                                  // res.json("sold");
                                  //res.render("storelogin/billprint",{data:rschemee,body:req.body,customer:ctable,scheme:rscheme,invoice:parseInt(result.insertId),prevpoint:0})


                                }
                              });
                            }
                          });
                        }









                        var financeamount = priceforfn -  (rscheme[0].discount + req.body.test) 
                        console.log("My Finance Ammount ",financeamount)

                        pool.query(`update bill set financeamount = ? where id = ?`, [financeamount,result.insertId], (financeerror, financeresult) => { 
                          if(financeerror){
                            console.log(financeerror)
                          }
                          else{
                            console.log("&&&&&&&&&&&&  ",financeresult)
                            res.render("storelogin/billprint", {
                              data: rschemee,
                              body: req.body,
                              customer: ctable,
                              scheme: rscheme,
                              invoice: parseInt(result.insertId),
                              prevpoint: 0
                            })
                          }
                        })

                        
                        //  res.render("storelogin/billprint",{data:rschemee,body:req.body,customer:ctable,scheme:rscheme,invoice:parseInt(result.insertId),prevpoint:0})

                      })

                    }
                  });
                }
              })
            })

          })

        })

      } else { //Existing Customer
        pool.query(`Select * from  brand where id = ?`, parseInt(req.body.brandid1), (serror, rscheme) => {


          //Set Otp Auth For Credit Points And Gadget----- START-------                     
          var otp = otpGenerator.generate(6, {
            upperCase: false,
            alphabets: false,
            specialChars: false
          });
          //Set Otp Auth For Credit Points And Gadget----- END-------   
          console.log("Your OTP is ", otp)

          /* console.log("Your req.body is ",req.body.cmobile)
           console.log("Your req.body is ",req.body.brandname)
           console.log("Your req.body is ",req.body.modelname)
          
           console.log("Your rscheme is ",rscheme[0].point)
           console.log("Your rscheme is ",rscheme[0].gadget)
           console.log("Your rscheme is ",ctable[0].name)*/
          // console.log("Your ctable is ",ctable)
          //let str = `Thanks For Purchasing ${req.body.brandname} ${req.body.modelname} Mr. ${ctable[0].name} And Congratualtion you have won ${rscheme[0].gadget} + ${rscheme[0].point} Points Plese Give this Otp to our sales executive ${otp} `;  

          localStorage.setItem("otp", otp);
          localStorage.setItem("body", JSON.stringify(req.body));
          localStorage.setItem("customer", JSON.stringify(ctable));
          localStorage.setItem("scheme", JSON.stringify(rscheme));

          //console.log("Invoice No. Is => ",invc[0].id)
          //var p = JSON.stringify(req.body)
          // let bdy={mbl:"9770856257",otps:"Thanks For Purchasing"+req.body.brandname+" "+req.body.modelname+" "+"Mr."+" "+ctable[0].name+" "+"And Congratualtionyou have won"+rscheme[0].gadget+" "+rscheme[0].point+" "+"Points Plese Give this Otp to our sales executive "+otp};
          //{ firstName: 'Fred', lastName: 'Flintstone'}


          pool.query(`Select * from  appworkinghours`, (errorforotp, resultdb) => {
            if(errorforotp){
              console.log(errorforotp)
            }
            else{
              console.log("Result For OTPBill ",resultdb[0].otpbill )



            if(resultdb[0].otpbill == 1)
            {
              const bdy = {
                mbl: req.body.cmobile,
                otps: otp
              }
    
              axios.post(`${process.env.BASE_URL}/api/sendotp`, bdy)
                .then(function (response) {
                 // console.log(response);
                })
                .catch(function (error) {
                 // console.log(error);
                });
    
              res.render("storelogin/otpwindow", {
                msg: "Please Enter OTP For Verification",
                otpmsg: otp,
                mob: req.body.cmobile,
                status: resultdb[0].otpbill
      })

            }else{


              res.render("storelogin/otpwindow", {
                msg: "Please Enter OTP For Verification",
                otpmsg: otp,
                mob: req.body.cmobile,
                status:resultdb[0].otpbill
              })






              
    }
  }
})



         
          //res.status(200).json(currentpuchasepoint+previouspurchasepoint);  

          //----------------------------OTP AUTH End--------------



        })
      }
    }
  })

  /*const {
    imeino,
    receiverid,
    senderid
  } = req.body;
  const query = `update feedstock set storeid = 0, storename = 'Sold' where imeino = ? and storeid = ?;`;
  pool.query(query, [imeino, senderid], (err, result) => {
    if (err) {
      console.log(err);
      res.json(false);
    } else if (result.affectedRows == 0) {
      res.json("not found");
    } else {
      const transferQuery = `insert into sold (storeid, imeino, date) values (?,?, CURRENT_DATE())`;
      pool.query(transferQuery, [senderid, imeino], err => {
        if (err) {
          console.log(err);
          res.json(false);
        } else {
          res.json("sold");
        }
      });
    }
  });*/
});



router.get('/change-password', (req, res) => {
  res.render('admin/changePassword');
})

router.post('/change-password', (req, res) => {
  try {
    const {
      confirm_password,
      password,
      current_password
    } = req.body;
    if (confirm_password != password) {
      return res.send("Password and confirm password is not same")
    }
    pool.query(`select * from admin where password = ?`, current_password, (err, result) => {
      if (err) {
        console.log("err", err);
        res.send('Internal error occurred');
      } else if (result.length == 1) {
        const data = {
          password
        };
        const query = `update admin set ?`;
        pool.query(query, data, (err, result) => {
          if (err) {
            console.log("err", err);
            res.send('There is some problem completing your request.');
          } else {
            res.send("<h2>Successfully changed</h2>");
          }
        });
      } else {
        res.send("Current password is incorrect");
      }
    })
  } catch (error) {
    console.log("error", error);
    res.send('There is some problem completing your request.');
  }
});

module.exports = router;