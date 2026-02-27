//this is made to know if the supabase provided has the admin or student role so to know what authority does this id have 


import User from '../models/user.js';

export const isAdmin = async (req,res,next)=>{
  try{
    const supabaseId = req.headers['x-user-id'];
    if(!supabaseId){
      const error = new Error("no user found with this id");
      error.statusCode=401;
      return next(error);
    }

    const user = await User.findOne({supabase_id:supabaseId});

    if(user && user.role === 'admin'){
      next();
    }else{
      const error = new Error("you do not have this previlege");
      error.statusCode=403;
      next(error);
    }
  }catch(error){
    next(error);
  }
};