import {z} from 'zod';

export const validateUserSync =(req,res,next)=>{
  const userSyncSchema = z.object({
    supabase_id: z.string().min(1,"supabase Id is required"),
    email:z.string().email("a valid email is required"),
    name:z.string().min(2,"name must be at least 2 characters"),
  });

  try{
    userSyncSchema.parse(req.body);
    next();
  }catch(error){
    const errorMessage = error.errors.map(err=>err.message).join(". ");
    const customError = new Error(errorMessage);
    customError.statusCode=400;
    next(customError);
  }
};



//enrollment protection with zod
export const validateEnrollment = (req,res,next)=>{
  const enrollmentSchema = z.object({
    userId:z.string().min(1,"user ID is required"),
    courseId:z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Course ID format"),
  });

  try{
    enrollmentSchema.parse(req.body);
    next();
  }catch(error){
    const errorMessage = error.errors.map(err=>err.message).join(". ");
    const customError = new Error(errorMessage);
    customError.statusCode =400;
    next(customError);
  }
};



//course validator with zod 
export const validateCourse = (req,res,next)=>{
  const courseSchema = z.object({
    title: z.string().min(5,"title must be atleast 5 chars"),
    description: z.string().min(10,"description is too short"),
    price:z.coerce.number().nonnegative("price can not be negative"),
    instructor:z.string().min(2,"instructor name is required"),
    category:z.enum(["TOEFL", "IELTS", "GENERAL"],{
      errorMap:()=>({message:"please select a valid category"})
    }),
    subCategory: z.enum(['GRAMMER','Speaking','Exams','Revision'],{errorMap:()=>({message:"select a valid sub-category"})}),
    course_ID: z.string().length(4,"course Id must be 4 char exactly").toUpperCase(),
  });
  try{
    courseSchema.parse(req.body);
    next();
  }catch(error){
    const errorMessage = error.errors?
    error.errors.map(err=>err.message).join(". "):"validation failed";
    const customError = new Error(errorMessage);
    customError.statusCode=400;
    customError.statusCode=400;
    next(customError);
  }
};