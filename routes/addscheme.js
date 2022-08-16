const router = require('express').Router();
const pool = require('./pool');




router.get('/', (req, res) => {
    if (req.session.adminId) {
        pool.query(`Select * from brand`, (err, result) => {
            //MYSQL DATE concatenete Start
            /* var rawstr = result[0].date_register;
             var str =rawstr.toString();
             var rawdate = str.split(' ');
             var finaldate = rawdate[0]+"  "+rawdate[2]+"-"+rawdate[1]+"-"+rawdate[3]+"  "+rawdate[4]*/
            //MYSQL DATE concatenete END

            res.render("addscheme/addscheme", {
                data: result
            })
            console.log(result)
        })

    } else {
        res.send('Invalid')
    }
})




router.post('/create', (req, res) => {
    console.log("********************************************************",req.body)
    pool.query(`UPDATE brand SET point = ?`, req.body.point, (err, result) => {
        if (err) {
            console.log(err);
            res.send("False")
        } else {
            res.redirect("/addscheme")
        }
    })
})









module.exports = router;