const nodemailer = require('nodemailer');
var express = require('express');
var router = express.Router();

const app = express()
 
//创建一个smtp服务器
const config = {
    host: 'smtp.163.com',
    port: 465,
    auth: {
        user: 'y1newl@163.com',
        pass: 'zsq1997'
    }
};
// 创建一个SMTP客户端对象
const transporter = nodemailer.createTransport(config);
 
//发送邮件
function kkk(mail){
    transporter.sendMail(mail, function(error, info){
        if(error) {
            return console.log(error);
        }
        console.log('mail sent:', info.response);
    });
};


app.post('/svcode', function (req, res) {
    var email = request.body.email;
    response.render('register', { response: "Password and confirm password does not match up!" });
    //response.render('register', { response: "Password and confirm password does not match up!" });//数据传回前台
    var user_name = request.body.user_name;
    var code = number();
    //var date = new Date();
    //var isLive = "no";
    //去数据库中找有没有同名的用户名，这里就要自己写了，不同的数据库查询方法不同
    //var result =await DB.find('user',{user_name:user_name});
 
    //console.log(result);
 
    //if(result.length>0){
        //ctx.body ={success:false,message:"账号已经存在"}
    //}else{
    //response.render('register', { response: "账号可行" });//数据传回前台
    document.getElementById("cc").value = "账号可行";
    var mail = {
            // 发件人
        from: '<y1newl@163.com>',
            // 主题
        subject: '接受凭证',//邮箱主题
            // 收件人
        to:email,//前台传过来的邮箱
            // 邮件内容，HTML格式
        text: '用'+code+'作为你的验证码'//发送验证码
        };
 
    //var json = {user_name,email,code,date,isLive};
    //await DB.insert('user',json);//将获取到的验证码存进数据库，待会提交时要检查是不是一致
    kkk(mail);//发送邮件
    //}

})

function number(){
    var number = "";
    for(var i=0;i<3;++i){
        number+=Math.floor(Math.random()*10);
     }
     return number;
}



router.post('/doRegister',async (ctx)=>{
 
 
    console.log(ctx.request.body);
 
    var username = ctx.request.body.username;//获取用户名
    var password = ctx.request.body.password;//获取密码
    var code = ctx.request.body.code;//获取你输入的验证码
    
    //去数据库把刚刚在存验证码的时候一起存的那条记录找出来
    var result =await DB.find('user',{"user_name":username});
 
    var nowDate = (new Date()).getTime();//获取当前时间
 
    判断验证码是否正确，时间是否超过10分钟
    if(result[0].code===code && (result[0].date.getTime()) - nowDate <600000){
        //更新数据库的用户信息，把用户密码深的也存进去
        await DB.update('user',{user_name:username},{
            "password":password,
            "status":1,
            "isLive":"yes",//注册成功啦
            "add_time":tools.getTime()
        });
        
    }else{
        ctx.render('admin/error',{
            console.log("There are some mistakes. Please retry later.")
        })
 
    }
 
});

    
