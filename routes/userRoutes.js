import express from 'express';
import UserController from '../controllers/userController.js'; // Ensure this path is correct
import checkUserAuth from '../middlewares/auth-middleware.js';
const router = express.Router();

//Route Level Middleware - to protect route
router.use('/changepassword', checkUserAuth)

// Public routes
router.post('/register', UserController.userRegistration);
router.post('/login', UserController.userLogin);

// Protected routes (add these as necessary)
router.post('changepassword/', UserController.changeUserPassword);


export default router;
