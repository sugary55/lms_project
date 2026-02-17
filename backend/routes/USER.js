import express from 'express';
import User from '../models/user.js';

const router = express.Router();


// create or update user when loggin with subabase

router.post('/sync',async (req,res)=>{
  try{
    const{
      supabase_id,email,name
    }=req.body;

    if(!supabase_id || !email || !name){
      return res.status(400).json({
        message : "missing credintials",
        success : false
      })
    }
    let user = await User.findOne({supabase_id});
    if(user){
      user.last_login = new Date();
      user.last_active = new Date();
      await user.save();

      return res.status(200).json({
        message: "user logged in successfully",
        success: true,
        user:{
          id :user._id,
          name: user.name,
          email: user.email,

        } 
      })
    }else{
      const newUser = await User.create({
        supabase_id,
        name,
        email,
        last_active: new Date(),
        last_login: new Date()
      });

      return res.status(201).json({
        message:"sign up successfully",
        success: true,
        user : {
          id : newUser._id,
          name: newUser.name,
          email: newUser.email,
          
        }
      });
    }
  }catch(error){
    console.error(`error syncing user from supabase: ${error.message}`);

    res.status(500).json({
      message:"internal server error",
      success: false
    });
  }
});

//get current user details

router.get('/me',async (req,res)=>{
  try{
    const {supabase_id} = req.headers;
    if(!supabase_id){
      return res.status(401).json({
        message: "unauthorized",
        success: false
      });
    }
    const user = await User.findOne({supabase_id}).select('-__v');

    if(!user){
      return res.status(404).json({
        message: "user not found",
        success: false 
      });
    }
    res . status(200).json({
      success: true,
      user: {
        id : user._id,
        name : user.name,
        email : user.email,
        created_at : user.created_at,
        last_login : user.last_login
      }
    });
  }catch(error){
    console.error(`error fetching current user ${error.message}`);
    res.status(500).json({
      message: "internal server error",
      success: false
    })
  }
});

//update user profile

router.patch('/:id',async(req,res)=>{
  try{
    const updates = req.body;

    delete updates.supabase_id;
    delete updates.email;
    delete updates._id;

    const user = await User.findByIdAndUpdate(req.params.id,{...updates, last_active : new Date()},{new :  true, runValidators : true}).select('-__v');
    if(!user){
      return res.status(404).json({
        message: "user not found",
        success : false
      });
    }
    res.status(200).json({
      message:"user updated succesfully",
      success : true,
      user
    })
  }catch(error){
    console.error(`error updating user profile${error.message}`);
    res.status(500).json({
      message:"internl server error",
      message: false
    });
  }
});

export default router;