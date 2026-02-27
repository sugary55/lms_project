import { syncUser,getMe,enrollInCourse,getEnrolledCourses } from '../controllers/userController.js';
import { validateUserSync,validateEnrollment } from '../middleware/validator.js';
import express from 'express';


const router = express.Router();

router.post('/sync',validateUserSync,syncUser);
router.get('/me',getMe);
router.post('/enroll',validateEnrollment,enrollInCourse);
router.get('/:userId/enrolled-courses',getEnrolledCourses);

export default router;