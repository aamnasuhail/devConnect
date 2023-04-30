const jwt = require('jsonwebtoken');
const config = require('../../environment/environment');
const User = require('../models/user');

module.exports = (req,res,next)=> {
    const {authorization} = req.headers;
    // authorization === Bearer efdshgdsgjkieuojkjd
    if(!authorization){
       return res.status(401).json({status : 'failed', error : 'you must be logged in'});
    }
   const token =  authorization.replace("Bearer ","");
   jwt.verify(token, config.JWT_SECRET, (err,payload)=> {
       if(err){
           return res.status(401).json({status : 'failed', error : 'you must be logged in'});
       }
       const {_id} = payload;
       User.findById(_id)
        .then(userdata => {
          req.user = userdata
          next()  
        })
        
   })

}