var express=require('express');
var router=express.Router();
router.use(express.static('public'));
const { Session } = require('inspector');
var mysql=require('mysql2');
var util=require('util');
var session=require('express-session')

router.use(express.static('public'));
router.use(session({
    secret:'A2ZITHUB',
    resave:false,
    saveUninitialized:true
}))
function logincheck(req,res,next){
    if(req.session.name){
        next();
    }else{
        res.redirect('/admin')
    }
}

var conn=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'Diksha@212',
    database:'simone'
})
var exe=util.promisify(conn.query).bind(conn);
router.use(express.urlencoded({extended:true}))

router.get('/',async(req,res)=>{
    var sql='select * from home1 where hid=1';
    data=await exe(sql);
    res.render("web/index.ejs",{data:data[0]});
})
router.get('/about',async(req,res)=>{
    var sql='select * from about where aid=1';
    data=await exe(sql);
    res.render("web/about.ejs",{data:data[0]});
})
router.get('/services',async(req,res)=>{
    var sql='select * from service';
    var data=await exe(sql);
    res.render("web/services.ejs",{data:data});
})
router.get('/resume',async(req,res)=>{
    var sql='select * from education';
    var sql1='select * from experience';
    var sql2='select * from skill';
    var data=await exe(sql);
    var data1=await exe(sql1);
    var data2=await exe(sql2);
    res.render("web/resume.ejs",{data,data1,data2:data,data1,data2})
})
router.get('/portfolio',async(req,res)=>{
    var sql='select * from work';
    var data=await exe(sql);
    res.render("web/portfolio.ejs",{data:data})
})
router.get('/clients',async(req,res)=>{
    var sql='select * from client1';
    var data=await exe(sql);
    res.render("web/clients.ejs",{data:data})
})
router.get('/contact',async(req,res)=>{
    var sql='select * from contact';
    var data=await exe(sql);
    res.render("web/contact.ejs",{data:data})
})
router.post('/contact_save',async(req,res)=>{
    //res.send(req.body);
    var {name,email,message}=req.body;
    var da=new Date();
    var date1=da.getDate()+"-"+ Number(da.getMonth()+1)+"-"+da.getFullYear();
    var sql = 'insert into contact_data(name,email,message,status,cdate)values(?,?,?,?,?)';
    var data=await exe(sql,[name,email,message,'pending',date1]);
    res.redirect('/contact');


})
module.exports=router;