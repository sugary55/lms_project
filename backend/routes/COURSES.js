import express from 'express';
import {createCourse,getAllCourses,getCourseByID} from "../controllers/courseController.js";


const router = express.Router();

//public Routes
router.get("/",getAllCourses);
router.get("/:id",getCourseByID);

//admin routes(add admin role to user model and routes)
router.post("/add",createCourse);

export default router;

