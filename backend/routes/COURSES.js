import express from 'express';
import {addLessons, addSection, createCourse,getAllCourses,getCourseByID} from "../controllers/courseController.js";
import { validateCourse } from '../middleware/validator.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

//public Routes
router.get("/",getAllCourses);
router.get("/:id",isAdmin,validateCourse,getCourseByID);

//admin routes(add admin role to user model and routes)
router.post("/add",isAdmin,validateCourse,createCourse);
router.post("/:id/section",isAdmin,addSection);
router.post('/:id/section/:sectionIndex/lesson',isAdmin,addLessons);
export default router;

