import Course from "../models/course.js";

//1.Create a new course (admin only logic later)
export const createCourse = async (req,res,next)=>{
  try{

    const newCourse = new Course({...req.body,course_ID:req.body.course_ID.toUpperCase()
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);

  }catch (error){

    if(error.code === 11000){
      const conflictError = new Error(`course ID "${req.body.course_ID}" already exists.`);
      conflictError.statusCode=409;
      return next(conflictError);
    }
    next(error);
  }
};



//2.get all courses (with Popular/Featured logic)
export const getAllCourses = async(req,res,next)=>{
  try{
      const {featured} = req.query;
      let query = {};

      if(featured === 'true'){
        query = {isFeatured: true};
      }
      
      const courses = await Course.find(query).sort({enrollmentCount: -1});
      
      res.status(200).json(Array.isArray(courses)? courses : [])
      }catch(error){
        next(error);
      }
};


//3.get a single course detail(for students to know the overview of a single course they wann join)

export const getCourseByID = async(req,res,next)=>{
  try{
    const course = await Course.findOne({course_ID:req.params.id.toUpperCase()});

    if(!course){
      const error = new Error("Course not Found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json(course);
  }catch(error){
    next(error);
  }
};


//4.update course 
export const updateCourse = async (req,res,next)=>{
  try{
    const{id}=req.params;
    const{course_ID,...updateData}=req.body;
    const updatedCourse = await Course.findOneAndUpdate(
      {course_ID:id.toUpperCase()},
      {$set:updateData},
      {new:true,runValidators:true}
    );
    if(!updatedCourse){
      const error = new Error("course not found");
      error.statusCode=404;
      return next(error);
    }
    res.status(200).json(updatedCourse);
  }catch(error){
    if(error.name === 'Validation Error'){
      error.statusCode=400;
    }
    next(error);
  }
}


//5.add sections to the course this is the array were we store the lessons 
export const addSection = async(req,res,next)=>{
  try{
    const {id} = req.params;
    const {title} = req.body;

    const updatedCourse = await Course.findOneAndUpdate(
      {course_ID:id.toUpperCase()},
      {$push:{sections:{title,lessons:[]}}},
      {new:true}
    );

    if(!updateCourse){
      const error = new Error("Course not found");
      error.statusCode=404;
      return next(error);
    }
    res.status(200).json(updatedCourse);
  }catch(error){
    next(error);
  }
};


//6.add lessons
//thi is where we store the lessons in the sections array in database 
//we use supabase storge and only store the url in mongo 

export const addLessons = async(req,res,next)=>{
  try{
    const{id,sectionIndex}=req.params;
    const lessonData = req.body;
    const updatePath = `sections.${sectionIndex}.lessons`;

    const updatedCourse = await Course.findOneAndUpdate(
      {course_ID:id.toUpperCase()},
      {$push:{[updatePath]:lessonData}},
      {new:true,runValidators:true}
    );
    if(!updatedCourse){
      const error = new Error("course not found");
      error.statusCode=404;
      return next(error);
    }
    res.status(200).json(updatedCourse);
  }catch(error){
    next(error);
  }
}
