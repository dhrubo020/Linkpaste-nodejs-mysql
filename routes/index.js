/*
* GET home page.
*/
//-------------show all items in homepage-----------------

exports.call_index = function(req, res){
    if(req.session.username!=null){
      console.log(req.session.username);
          let query = "SELECT * FROM `message` WHERE `To`='"+req.session.username+"' ORDER BY Id DESC"; // query database to get all the players
          let message='';
          // execute query
          db.query(query, (err, result) => {
              if (err) {
                console.log('home error');
                  res.redirect('/');
              }else{
                console.log('home ok');
                message = 'Homepage';

                res.render('home.ejs', {
                    message: message
                    ,items: result
                });
              }
          });
    }else{
      res.render('login.ejs',{message:"You must login first"});
    }
}
