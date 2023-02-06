
const express = require('express')
const app = express()
const pw = process.env.password;

const mysql = require('mysql2')
const dbwrite = mysql.createPool({
host:"34.142.197.56",
user:"root",
password:pw,
port:3306,
database:'discountdb'


})



const port = 6327

app.post("/api/v1/discountapply/:shopcartId/:discount_id",(req,res) =>{
   const discountId = req.params.discount_id;
   const shopCartId = req.params.shopcartId;
   dbwrite.query("insert into cartdiscount values(?,?)",[shopCartId,discountId],function(err,results){
    if (err) {
        res.status(400).end();
    }else{
        console.log("inserted into cartdiscount");
        dbwrite.query("select * from discounts inner join cartdiscount on cartdiscount.discountId=discounts.discountId where cartdiscount.shopCartId=? ",[shopCartId],function(err,results){
            if (err) {
                res.status(400).end();
            }else{
                console.log("show all discount applied in cart upon applying new discount ");
                res.json(results);
                res.status(200).end();
    
            }
           
           
           }); 
    }

    

   }); 


});

app.get("/api/v1/discounts",(req,res) =>{

 
    dbwrite.query("select * from discounts",function(err,results){
     if (err){
        res.status(400).send(err);
     }else{
        console.log("get all discounts");
         //array of objects 
         res.json(results);
         res.status(200).end();
     
     }
     
    }); 
 
 });



 app.get("/api/v1/discounts/:shopcartId",(req,res) =>{
    const shopCartId = req.params.shopcartId;
    dbwrite.query("select * from discounts inner join cartdiscount on cartdiscount.discountId=discounts.discountId where cartdiscount.shopCartId=? ",[shopCartId],function(err,results){
        if (err || results.length==0) {
            res.status(400).end();
        }else{
            console.log("show all discount applied in cart");

            res.json(results);
            res.status(200).end();
            
        }
       
        
       
       }); 
 
 
    
 
 });


app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})

