var bdTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Dhaka"});
var date = new Date(bdTime);
console.log('BD time: '+date.toLocaleString())


//-------------Send-----------------
exports.call_send = function(req, res){
   message = '';
   if(req.method == "POST"){
      
      var post  = req.body;
      var from = req.session.username;
      var to =post.username;
      var msg = post.msg;
      //var str = new Date().toISOString().slice(0, 19).replace('T', ' ');
      //var date = str.substring(0, 23);
      //var date = new Date().toJSON().slice(0, 19).replace('T', ' ')
      var bdTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Dhaka"});
      var date = new Date(bdTime);
      console.log('BD time: '+date.toLocaleString())

      var sql="SELECT * FROM `userlist` WHERE `Handle` ='"+to+"'  ";                           
      var query = db.query(sql, function(err, results_list){ 
         if(results_list.length>0)
         {  
            var sql = "INSERT INTO `message` (`Text`,`From`,`To`,`DateTime`) VALUES ('" + msg + "','" + from + "','" + to + "', '" + date.toLocaleString()+ "')";
             var query = db.query(sql, function(err, result) {
                
                  if(err){
                     message = "Something went wrong!!";
                     res.render('home.ejs',{message: message});
                  }else{
                     console.log("send success");
                     message = "Succesfully! Your account has been created. Now you can login.";
                     res.redirect('/');
                  }
            });
         }else{
            res.redirect('/');
           // alart('User not found!!')
         }
   });
}
   else{
      res.locals.user='';
      res.redirect('/');
      //alart('Not send !!')
   }
};
//---------------------------call sign up function---------------------------------
exports.call_signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var success = 'no';
      let date = new Date().toISOString().slice(0, 19).replace('T', ' ');

      var username = post.username;
      var email= post.email;

      var sql="SELECT * FROM `userlist` WHERE Handle ='"+username+"'  ";       
      console.log(username);                    
      var query = db.query(sql, function(err, results_list){ 
         if(err){
            message = 'An error occured!!';
            res.render('signup.ejs',{message: message});
         }  
         else if(results_list.length>0){
            console.log(username); 
            message = 'This user is already exist!!';
            res.render('signup.ejs',{message: message});
         }
         else
         {  console.log("///////")
            var sql = "INSERT INTO `userlist`(`Email`,`Handle`) VALUES ('" + email + "','" + username + "')";
             var query = db.query(sql, function(err, result) {
                console.log("///////")
                  if(err){
                     message = "Something went wrong!!";
                     res.render('signup.ejs',{message: message});
                  }else{
                     success='1';
                     message = "Succesfully! Your account has been created. Now you can login.";
                     res.render('login.ejs',{message: message});
                  }
            });
         }
      });
   }else{
      res.locals.user='';
      res.render('signup.ejs');
   }
};

//-----------------------------------------------login page call------------------------------------------------------
exports.call_login = function(req, res){
   var message = '';
  
   if(req.method == "POST"){
      var post  = req.body;
      var username = post.username;
      
      var sql="SELECT * FROM `userlist` WHERE Handle ='"+username+"' ";                           
      db.query(sql, function(err, results_login){     
         if(results_login.length>0){
            //console.log(username);
            var sql="SELECT * FROM `message` WHERE `To` ='"+username+"' ";                           
            db.query(sql, function(err, results_customer){     
                     if(results_customer.length>=0){
                        //console.log(username);
                           req.session.user = username;
                           req.session.username = username;
                           res.locals.user = username;
                           //console.log(res.locals.username);
                        res.redirect('/');
                     }
                     else{
                        message = 'Error in finding the user.';
                        res.render('login.ejs',{message: message});
                     }
            });
               
         }
         else{
            message = 'Wrong Username';
            res.render('login.ejs',{message: message});
         }
                 
      });
   }
   else {
        res.redirect("/");
         //res.locals.user='';
         //res.render('login.ejs',{message: message});
      }
};
//-----------------------------------------------dashboard page functionality----------------------------------------------
           
exports.dashboard = function(req, res, next){
           
   var user =  req.session.user,
   userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `login` WHERE `Login_ID`='"+userId+"'";

   db.query(sql, function(err, results){
      res.render('dashboard.ejs', {user:user});    
   });       
};
//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};
//--------------------------------Profile page render user details after login--------------------------------
exports.profile = function(req, res){

   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql = " SELECT * FROM customer LEFT JOIN login ON (customer.Customer_ID=login.Login_ID) WHERE login.`Login_ID` = '"+userId+"' and customer.`Customer_ID`='"+userId+"' ";

   //var sql="SELECT login.Email as email, login.Phone as phone JOIN  `customer` WHERE `Customer_ID`='"+userId+"'";
   db.query(sql, function(err, result){ 
      if(result.length>0){
         message='';
         res.render('profile.ejs',{data:result,message:message});
      }
      else{
         message='';
         res.render('add_details.ejs',{id:userId,message:message});
      }
      
   });
};
//---------------------------------edit users details after login----------------------------------
exports.editprofile=function(req,res){
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
   db.query(sql, function(err, results){
      res.render('edit_profile.ejs',{data:results});
   });
};
//---------------------------------Password Recovery (Email search) ----------------------------------------------------//
exports.passwordRecovery = function(req, res){
   var message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var email= post.email;
     
      var sql="SELECT * FROM `users` WHERE `email`='"+email+"'";   
                             
      db.query(sql, function(err, results){      
         if(results.length){
            console.log(results[0].id);
            res.render('reset.ejs',{data:results,message: message});
         }
         else{
            console.log('email search err1');
            message = 'Email not found.';
            res.render('passwordRecovery.ejs',{message: message});
         }
      });
   } else {
      console.log('email search err2');
      res.render('passwordRecovery.ejs',{message: message});
   }    
};
//--------------------------------------Reset password -----------------------------------------------------//
exports.reset=function(req,res){
   
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var email = post.email;
      var password = post.password1;
      var sql = "UPDATE `users` SET `password` = '" + password + "' WHERE `users`.`email` = '" + email + "'";
      var query = db.query(sql, function(err, result) {
         if(err){
            message = "Something went wrong!!";
            res.render('passwordRecovery.ejs',{message: message});
         }else{
         message = "Succesfully! Your password has been updated. Now you can log in with new password.";
         res.render('index.ejs',{message: message});
         }
      });

   } else {
      res.render('passwordRecovery.ejs');
   }
};
//------------------------Cart-----------------
exports.call_cart = function(req,res){
   res.render('cart_list.html');
}