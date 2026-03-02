import express from 'express';
import {addLessons, addSection, createCourse,deleteCourse,getAllCourses,getCourseByID, toggleFeatured} from "../controllers/courseController.js";
import { validateCourse } from '../middleware/validator.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

//public Routes
router.get("/",getAllCourses);
router.get("/:id",getCourseByID);

//admin routes(add admin role to user model and routes)
router.post("/add",isAdmin,validateCourse,createCourse);
router.post("/:id/section",isAdmin,addSection);
router.post('/:id/section/:sectionIndex/lesson',isAdmin,addLessons);
router.delete("/:id",isAdmin,deleteCourse);
router.patch('/:id/featured',isAdmin,toggleFeatured);

export default router;

