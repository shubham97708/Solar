var express = require("express");
var router = express.Router();
var pool = require("./pool");
const jwt = require('./jwt');
var CronJob = require('cron').CronJob;
const https = require("http").createServer(router);
const io = require("socket.io").listen(https);
const port = 352;


router.get("/", function (req, res, next) {
  pool.query(`select * from appworkinghours`, (err, result) => {
    if (err) throw err;
    else {
      //  res.send(result)
      return res.json(result);
    };
  })
})





router.get("/edit", function (req, res, next) {
  pool.query(`select * from appworkinghours`, (err, result) => {
    if (err) throw err;
    else {
      res.render("appworkinghours/appworkinghours", {
        data: result
      })

    };
  })
})






router.post('/edit', function (req, res, next) {
  console.log(req.body)
  pool.query('update appworkinghours set start=?,end=? , otpreq=? , otpbill = ? where id=?', [req.body.start, req.body.end, req.body.otpreq,req.body.otpbill, 1], function (error, result) {
    console.log('Error', error)
    if (error) {
      return res.status(500).json({
        RESULT: false
      })
    } else {
      //return res.status(200).json({RESULT:true})
      console.log("apna result ", result)
      //res.render("appworkinghours/appworkinghours",{data:result})
      res.redirect("/appworkinghours/edit")
    }
  })

});


//-----------Delete Previous Login USER-----------------------

router.post('/delete', function (req, res, next) {
  // console.log("Deletee Body  ",req.body) 
  pool.query('delete from loggedInUsers where userid=? AND token!=?', [req.body.id, req.body.tkn], function (error, result) {
    console.log('Error', error)
    if (error) {
      return res.status(500).json({
        RESULT: false
      })
      //console.log("Deleted Result SWith  Error ",error)
    } else {
      //  console.log("Deleted $$$$ Result",result)

      return res.status(200).json({
        RESULT: result,
        BODY: req.body
      })

    }
  })
});

//-----------------------------------------------------------------






 router.get('/logoutallmobile', function (req, res, next) {
     const query = `delete  from loggedInUsers `;
      pool.query(query,(err, result) => {
          if (err) {
              return res.json({
                  err,
                  status: false
              });
          }
          return res.json({
              status: true
          });
      }); 
}); 







//------------------All User Logout By Selected Timing   Start-----------
io.on("connection", httpsocket => {
  console.log("a user connected :D");

  var Minute = 07
  new CronJob(`0 ${Minute} 10 * * *`, function () {
    console.log('Sandeep Sappal Hiiii........');
    io.emit("alluserlogout", "yes");

  }, null, true, 'Asia/Kolkata');
})
//----------------------All User Logout End--------------------------------





https.listen(port, () => console.log("React Native Socket Server running on port:" + port));
module.exports = router;