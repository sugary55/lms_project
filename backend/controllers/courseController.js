import Course from "../models/course.js";


//1.Create a new course (admin only logic later)
export const createCourse = async (req,res)=>{
  try{
    const newCourse = new Course(req.body);
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  }catch (error){
    res.status(400).json({message:"Error creating course",error:error.message});
  }
};



//2.get all courses (for homepage)
export const getAllCourses = async(req,res)=>{
  try{
    const courses = await Course.find().select("title price course_ID");//only fetch title ,price ,ID
    res.status(200).json(courses);
  }catch(error){
    res.status(500).json({message:"Server Error",error})
  }
};


//3.get a single course detail(for students to know the overview of a single course they wann join)

export const getCourseByID = async(req,res)=>{
  try{
    const course = await Course.findOne({course_ID:req.params.id.toUpperCase()});
    if(!course)return res.status(404).json({message:"course not found"});
    res.status(200).json(course);
  }catch(error){
    res.status(500).json({message:"Error Fetching the course"});
  }
};