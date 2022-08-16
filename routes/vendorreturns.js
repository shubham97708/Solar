const express = require('express');
const router = express.Router();
const pool = require('./pool');

router.get('/', (req, res) => {
    res.render('vendorreturns/byadmin',{datas:''});
})
router.post('/filldatabyimeino',(req,res)=>{
var imeino=req.body.imeimob
    const qr=`select *,(select firmname from vendor V where V.id=f.vendorid) as vendorname,(select name from brand B where B.id=f.brandid) as brandname,(select name from model  M where M.id=f.modelid and M.brandid=f.brandid) as modelname ,(select modelno from model m where m.id=f.modelid and m.brandid=f.brandid) as modelno from feedstock f where  f.imeino=${imeino}`
    console.log("Query ",qr)
    pool.query(`${qr}`,(err,result)=>{
        if (err) {

            res.status(500).json({
              RESULT: false
            });
          } 
        else{

            if (result.length == 0) // Not Found IMEI NO. In Table condition 1
            {
              // res.status(200).json({RESULT:false});
              res.status(200).json({
                data: [{id:'',modelid:'',price:'',imeino:'',selled:'',brandid:'',color:'',storeid:''}]
              });
      
            //  console.log(re, "Mobile Not Found")
            } else {
           
            console.log(result)
            res.status(200).json({
                
                data: result[0]
            });
          
        }
    }})
})

router.post('/submit',(req,res)=>{
  console.log(req.body)
global.message;
var no=req.body.imeimob.length
  //  console.log(Object.keys(req.body).length)
   console.log(no)
   
var qr=[]
var query=``
var query1=``
var imei=''
var im=[]
var reason=''
var q_s=''

var a=Object.values(req.body.imeimob)
for(var i=0;i<2;i++){
    if(a[i]){}
}
//checking key value contain array or not
if(a[0]=='1'||a[0]=='2'||a[0]=='3'||a[0]=='4'||a[0]=='5'||a[0]=='6'||a[0]=='7'||a[0]=='8'||a[0]=='9'||a[0]=='0'){
a=1
console.log(true)
}
else{a=0
    console.log(false)  
}
if(a==1){
    console.log("Enter first loop")
    imei=req.body.imeimob
    reason=req.body.reason
    q_s=`select * from feedstock where imeino=${imei}`
    pool.query(`${q_s}`,(err,result)=>{
        
            if(err){ }
            else{
           
           
           query=`insert into vendor_returns (storeid,vendorid,reason,imeino) values(${result[0].storeid},${result[0].vendorid},'${reason}',${result[0].imeino})`
               
           
          
            pool.query(`${query}`,(err,result)=>{
                    if(err){}
                    else{
                     
                        query1=`update feedstock set storeid=0,storename='Returned' where imeino=${imei}`
                    
                        pool.query(`${query1}`,(err,result)=>{
                            if(err){
                                    global.message=' Returned Failed'
                                    res.render('vendorreturns/byadmin',{datas:message})
                                }
                                else{global.message='SuccesFully Returned'
                                    res.render('vendorreturns/byadmin',{datas:message})}
                                
                                })
                            }
                            
                     })}
        
            })
                               
                        
    

}
else{ 
    console.log("Enter Second loop")
    for(var i=0;i<no;i++){
     im[i]=req.body.imeimob[i]
    }
for(var i=0;i<no;i++){
  
 imei=req.body.imeimob[i]
    reason=req.body.reason[i]

    q_s=`select * from feedstock where imeino=${imei}`
    pool.query(`${q_s}`,(err,result)=>{
    if(err){
        console.log(err)
        }
        else{
           
            qr[i]=`insert into vendor_returns (storeid,vendorid,reason,imeino) values(${result[0].storeid},${result[0].vendorid},'${reason}',${result[0].imeino})`
       query=qr[i]
            imei=result[0].imeino
        pool.query(`${query}`,(err,result1)=>{
                if(err){
                    console.log(err)
                }
                else{ 
                   imei=result[0].imeino
                 query1=`update feedstock set storeid=0,storename='Returned' where imeino=${imei}`
                    pool.query(`${query1}`,(err,result2)=>{
                        if(err) {
                            global.message ='Returned Failed'
                        } 
        
                        
                        else {global.message='SuccessFully Returned'
                            }        
                    })
                 
                }
        })
        
    }
    })
   
console.log("message",global.message)
}

res.render('vendorreturns/byadmin',{datas:global.message})
}
console.log("Message",global.message)
})


module.exports=router;