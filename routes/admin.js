var express=require('express');
const { Session } = require('inspector');
var router=express.Router();
var mysql=require('mysql2');
var util=require('util');
var session=require('express-session')
const fileupload=require('express-fileupload')
var path=require('path');
var fs=require('fs');

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
    host: 'bv6969uqcbzeeh0wtupu-mysql.services.clever-cloud.com',
    user: 'upbfefkwgyngm7yz',
    password:'4GRoy6tFsCcz0dp1OLCN',
    database:'bv6969uqcbzeeh0wtupu'
})
var exe=util.promisify(conn.query).bind(conn);
router.use(express.urlencoded({extended:true}))
router.use(fileupload(``))
router.get('/',(req,res)=>{
    res.render("admin/login.ejs");
})
router.post('/login_check',async(req,res)=>{
    //res.send(req.body);
    var {username,password}=req.body;
    var sql='select * from login where username=? and password=?'
    var data=await exe(sql,[username,password]);
    //res.send(data);
    if(data[0]){
        req.session.id=data[0].lid;
        req.session.name=data[0].name;
        res.redirect('/admin/dashboard');
    }else{
        res.redirect('/admin/')
    }
    //res.send(username);
    //res.redirect('/admin/dashboard');
})
router.get('/dashboard',(req,res)=>{
    //res.send(req.session.name);
    var name=req.session.name;
    res.render('admin/dashboard.ejs',{name:name});
})
router.get('/form',(req,res)=>{
    var name=req.session.name;
    res.render('admin/form.ejs',{name:name});
})  
router.get('/table',(req,res)=>{
    var name=req.session.name;
    res.render('admin/table.ejs',{name:name});
})
router.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/admin');
})
router.get('/service_add',(req,res)=>{
    res.render("admin/service_add.ejs")
})
router.post('/service_save',async(req,res)=>{
    //res.send(req.body);
    var {s_icons, s_title, s_desc}=req.body;
    var sql='insert into service(s_icons, s_title, s_desc)values(?,?,?)';
    var data=await exe(sql,[s_icons, s_title, s_desc]);
    res.redirect('/admin/service_add')
})
router.get('/service_list',async(req,res)=>{
    var sql='select * from service'
    var data=await exe(sql);
    //res.send(data);
    res.render("admin/service_list.ejs",{service:data});
})
router.get('/service_delete/:sid',(req,res)=>{
    var sid=req.params.sid;
    var sql=`delete from service where sid=${sid}`;
    conn.query(sql,(err,result)=>{
        res.redirect('/admin/service_list');
    })
})
router.get('/education_add',async(req,res)=>{
    res.render("admin/education_add.ejs")
})
router.post('/education_save',async(req,res)=>{
    //res.send(req.body);
    var {e_year,e_name,e_uni,s_desc}=req.body;
    var sql='insert into education(e_year,e_name,e_uni,s_desc)values(?,?,?,?)';
    var data=await exe(sql,[e_year,e_name,e_uni,s_desc]);
    res.redirect('/admin/education_add')
})
router.get('/education_list',async(req,res)=>{
    var sql='select * from education'
    var data=await exe(sql);
    //res.send(data);
    res.render("admin/education_list.ejs",{data:data});
})
router.get('/education_delete/:eid',(req,res)=>{
    var eid=req.params.eid;
    var sql=`delete from education where eid=${eid}`;
    conn.query(sql,(err,result)=>{
        res.redirect('/admin/education_list');
    })
})
router.get('/experience_add',async(req,res)=>{
    res.render("admin/experience_add.ejs")
})
router.post('/experience_save',async(req,res)=>{
    //res.send(req.body);
    var {e_year,e_name,e_uni,s_desc}=req.body;
    var sql='insert into experience(e_year,e_name,e_uni,s_desc)values(?,?,?,?)';
    var data=await exe(sql,[e_year,e_name,e_uni,s_desc]);
    res.redirect('/admin/experience_add')
})
router.get('/experience_list',async(req,res)=>{
    var sql='select * from experience'
    var data=await exe(sql);
    //res.send(data);
    res.render("admin/experience_list.ejs",{data:data});
})
router.get('/experience_delete/:eid',(req,res)=>{
    var eid=req.params.eid;
    var sql=`delete from experience where eid=${eid}`;
    conn.query(sql,(err,result)=>{
        res.redirect('/admin/experience_list');
    })
})
router.get('/skill_add',async(req,res)=>{
    res.render("admin/skill_add.ejs");
})
router.post('/skill_save',async(req,res)=>{
    //res.send(req.body);
    var {skill_n,skill_p}=req.body;
    var sql='insert into skill(skill_n,skill_p)values(?,?)';
    var data=await exe(sql,[skill_n,skill_p]);
    res.redirect('/admin/skill_add');
})
router.get('/skill_list',async(req,res)=>{
    var sql='select * from skill'
    var data=await exe(sql);
    //res.send(data);
    res.render("admin/skill_list.ejs",{data:data});
})
router.get('/skill_delete/:sid',(req,res)=>{
    var sid=req.params.sid;
    var sql=`delete from skill where sid=${sid}`;
    conn.query(sql,(err,result)=>{
        res.redirect('/admin/skill_list');
    })
})
router.get('/work_add',async(req,res)=>{
    res.render("admin/work_add.ejs");
})
router.post('/work_save',async(req,res)=>{
    var{w_title,w_desc}=req.body;
    var img=req.files.w_img;
    var imagename=req.files.w_img.name;
    var newname=Date.now()+imagename;
    var imgpath=path.join(__dirname,'../','public/image',newname)
    img.mv(imgpath,(err)=>{})
    var sql='insert into work(w_img,w_title,w_desc)values(?,?,?)';
    var data=await exe(sql,[newname,w_title,w_desc]);
    res.redirect('/admin/work_add');
})
router.get('/work_list',async(req,res)=>{
    var sql='select * from work'
    var data=await exe(sql);
    //res.send(data);
    res.render("admin/work_list.ejs",{data:data});
})
router.get('/delete/:wid/:w_img',(req,res)=>{
    var wid=req.params.wid;
    var w_img=req.params.w_img;
    var imgpath=path.join(__dirname,'../','public/image',w_img);
    fs.unlink(imgpath,(err)=>{ })
    var sql=`delete from work where wid=${wid}`;
    conn.query(sql,(err,result)=>{
        res.redirect('/admin/work_list');
    })
})
router.get('/client_add',async(req,res)=>{
    res.render("admin/client_add.ejs");
})
router.post('/client_save',async(req,res)=>{
    var{c_name,c_pro,c_desc}=req.body;
    var img=req.files.c_img;
    var imagename=req.files.c_img.name;
    var newname=Date.now()+imagename;
    var imgpath=path.join(__dirname,'../','public/image',newname)
    img.mv(imgpath,(err)=>{})
    var sql='insert into client1(c_img,c_name,c_pro,c_desc)values(?,?,?,?)';
    var data=await exe(sql,[newname,c_name,c_pro,c_desc]);
    res.redirect('/admin/client_add');
})
router.get('/client_list',async(req,res)=>{
    var sql='select * from client1'
    var data=await exe(sql);
    //res.send(data);
    res.render("admin/client_list.ejs",{data:data});
})
router.get('/delete_client/:cid/:c_img',(req,res)=>{
    var cid=req.params.cid;
    var c_img=req.params.c_img;
    var imgpath=path.join(__dirname,'../','public/image',c_img);
    fs.unlink(imgpath,(err)=>{ })
    var sql=`delete from client1 where cid=${cid}`;
    conn.query(sql,(err,result)=>{
        res.redirect('/admin/client_list');
    })
})
router.get('/home_update',async(req,res)=>{
    var sql='select * from home1 where hid=1';
    data=await exe(sql);
    res.render("admin/home_update.ejs",{data:data[0]});
})
router.post('/home_update_save/:id/:img',async(req,res)=>{
    var id=req.params.id;
    var oldimg=req.params.img;
    var {h_title1,h_title2,h_title3,h_desc}=req.body;
    if(req.files){
        var img=req.files.h_img;
        var imagename=req.files.h_img.name;
        var myphoto=Date.now()+imagename;
        var imgpath=path.join(__dirname,'../','public/image',myphoto)
        img.mv(imgpath,(err)=>{})
    }else{
        var myphoto=oldimg;
    }
    var sql='update home1 set h_img=?,h_title1=?,h_title2=?,h_title3=?,h_desc=? where hid=?';
    var data=await exe(sql,[myphoto,h_title1,h_title2,h_title3,h_desc,id]);
    res.redirect('/admin/home_update');
})
router.get('/about_update',async(req,res)=>{
    var sql='select * from about where aid=1';
    data=await exe(sql);
    res.render("admin/about_update.ejs",{data:data[0]});
})
router.post('/about_update_save/:id',async(req,res)=>{
    var id=req.params.id;
    var {a_title,a_desc,a_name,a_email,a_age,a_add,a_ctitle1,a_count1,a_ctitle2,a_count2,a_ctitle3,a_count3,a_ctitle4,a_count4}=req.body;
    var sql='update about set a_title=?,a_desc=?,a_name=?,a_email=?,a_age=?,a_add=?,a_ctitle1=?,a_count1=?,a_ctitle2=?,a_count2=?,a_ctitle3=?,a_count3=?,a_ctitle4=?,a_count4=? where aid=?';
    var data=await exe(sql,[a_title,a_desc,a_name,a_email,a_age,a_add,a_ctitle1,a_count1,a_ctitle2,a_count2,a_ctitle3,a_count3,a_ctitle4,a_count4,id]);
    res.redirect('/admin/about_update');
})
router.get('/contact_pending',async(req,res)=>{
    var sql='select * from contact_data where status=?';
    data=await exe(sql,['pending']);
    res.render("admin/contact_pending.ejs",{data:data});
})
router.get('/contact_pending_confirm/:id',async(req,res)=>{
    var id=req.params.id;
    var sql='update contact_data set status=? where cid=?';
    data=await exe(sql,['confirm',id]);
    res.redirect("/admin/contact_pending");
})
router.get('/contact_pending_reject/:id',async(req,res)=>{
    var id=req.params.id;
    var sql='update contact_data set status=? where cid=?';
    data=await exe(sql,['reject',id]);
    res.redirect("/admin/contact_pending");
})
router.get('/contact_complete',async(req,res)=>{
    var sql='select * from contact_data where status=?';
    data=await exe(sql,['confirm']);
    res.render("admin/contact_complete.ejs",{data:data});
})
router.get('/contact_reject',async(req,res)=>{
    var sql='select * from contact_data where status=?';
    data=await exe(sql,['reject']);
    res.render("admin/contact_reject.ejs",{data:data});
})

router.get('/contact_add',async(req,res)=>{
    res.render("admin/contact_add.ejs");
})
router.post('/contact_save',async(req,res)=>{
    //res.send(req.body);
    var {c_add,c_mob,c_email,c_fb,c_insta,c_yt,c_tw}=req.body;
    var sql='insert into contact(c_add,c_mob,c_email,c_fb,c_insta,c_yt,c_tw)values(?,?,?,?,?,?,?)';
    var data=await exe(sql,[c_add,c_mob,c_email,c_fb,c_insta,c_yt,c_tw]);
    res.redirect('/admin/contact_add');
})
router.get('/contact_list',async(req,res)=>{
    var sql='select * from contact'
    var data=await exe(sql);
    //res.send(data);
    res.render("admin/contact_list.ejs",{data:data});
})
router.get('/contact_delete/:cid',(req,res)=>{
    var cid=req.params.cid;
    var sql=`delete from contact where cid=${cid}`;
    conn.query(sql,(err,result)=>{
        res.redirect('/admin/contact_list');
    })
})
module.exports=router;
