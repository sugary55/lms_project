import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({

  title:{ type:String, required:true },

  category:{type: String,enum:['TOEFL','IELTS','GENERAL'],required:true },

  subCategory:{type: String,enum:['GRAMMAR','Speaking','Exams','Revision'], required:true},

  isFeatured:{type: Boolean, default:false },

  enrollmentCount:{type: Number, default:0 },

  description:{type: String },

  thumbnail:{ type: String},

  course_ID:{type:String,required:true,unique:true,maxLength:4, minLength:4},

  price:{type:Number,required:true, default:0 },

  created_at:{type:Date,default:Date.now},

  reviews:[{userId: String,userName: String,
    rating:{type: Number,min:1,max:5}, comment:String,
    created_at:{type:Date,default:Date.now}
    }],

  averageRating:{type: Number , default:0},

  sections:[{
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
          isPreview:{ type: Boolean, default:false },
          previewDuration:{type: Number,default: 0},
          isLocked :{ type:Boolean,default:true }
        }
      ]
    }]},{timestamps: true});


const Course = mongoose.model('Course', courseSchema);
export default Course;