import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true,
  },
  course_ID:{
    type:String,
    required:true,
    unique:true,
    maxLength:4,
    minLength:4
  },
  price:{
    type:Number,
    required:true,
    default:0
  },
  created_at:{
    type:Date,
    default:Date.now
  },
  sections:[
    {
      title:String,
      lessons:[
        {
          lessonTitle:String,
          contentType:{
            type:String,
            enum:['video','pdf','live','exam','revision'],
            default:'video'
          },
          contentUrl:String,
          isLocked :{type:Boolean,default:true}
        }
      ]
    }
  ]


})

const Course = mongoose.model('Course', courseSchema);
export default Course;