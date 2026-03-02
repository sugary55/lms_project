import User from '../models/user.js';
import Course from '../models/course.js';



//1.sync user (supabase auth login/signup)
export const syncUser = async(req,res,next)=>{
  try{
    const {supabase_id,email,name}=req.body;

    // "Upsert" logic: Update if exists, Create if not.
    const user = await User.findOneAndUpdate(
      {supabase_id},
      {email,name,last_login:new Date(),last_active: new Date()},
      {returnDocument:'after',upsert:true}
    );

    res.status(200).json({
      success:true,
      message:"user synced successfully",
      user:{id:user._id,name:user.name,email:user.email}
    });
  }catch(error){
    next(error);//global error handler
  }
};

//2.get user enrolled courses (already enrolled )
export const getEnrolledCourses = async(req,res,next)=>{
  try{

    const user = await User.findOne({supabase_id:req.params.userId}).populate('enrolledCourses');

    if (!user){
      const error = new Error("user not found");
      error.statusCode = 404;
      return next(error);
    }
     res.status(200).json(user.enrolledCourses || []);
  }catch(error){
    next(error);
  }
}

//3.enroll in a course(enroll in a new course)
export const enrollInCourse = async(req,res,next)=>{
  try{
    const {userId,courseId} = req.body;

    const courseDoc = await Course.findOne({ course_ID: courseId.toUpperCase() });

    //verify course exist
    if (!courseDoc) {
      const error = new Error('course not found');
      error.statusCode = 404;
      return next(error);
    }
    // 2. Add course to User AND Increment the course counter
   const [updatedUser] = await Promise.all([
      User.findOneAndUpdate(
        { supabase_id: userId },
        { $addToSet: { enrolledCourses: courseDoc._id } },
        { new: true }
      ),
      Course.findByIdAndUpdate(
        courseDoc._id,
        { $inc: { enrollmentCount: 1 } },
        { new: true } // This adds +1 to the count
      )
    ]);
    
    if(!updatedUser){
      const error = new error('enrollment failed: user not found');
      error.statusCode=404;
      return next(error);
    }

    res.status(200).json({
      success:true,
      message:"enrollment successfull",
      enrolledCount:updatedUser.enrolledCourses.length
    })
}catch(error){
  next(error);
  }
};

export const getMe = async(req,res,next)=>{
  try{
    const {supabase_id}=req.body;
    const user = await User.findOne({supabase_id}).select('-__v');

    if(!user){
      const error = new Error("user not found");
      error.statusCode=404;
      return next(error);
    }
    res.status(200).json({
      success:true,
      user
    });
  }catch(error){
    next(error);
  }
};