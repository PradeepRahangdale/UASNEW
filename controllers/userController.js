import UserModel from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserController {
  static userRegistration = async (req, res) => {
    const { name, email, password, password_confirmation, tc } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      res.send({ "status": "failed", "message": "Email already exists" });
    } else {
      if (name && email && password && password_confirmation && tc) {
        if (password === password_confirmation) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const doc = new UserModel({
              name: name,
              email: email,
              password: hashPassword,
              tc: tc
            });
            await doc.save();
            const saved_user = await UserModel.findOne({ email: email });
            // Generating JWT token
            const token = jwt.sign({ userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' });

            res.status(201).send({ "status": "success", "message": "User registered successfully", "token": token });
          } catch (error) {
            console.error('Error during user registration:', error);
            res.status(500).send({ "status": "failed", "message": "Unable to register" });
          }
        } else {
          res.send({ "status": "failed", "message": "Password and confirm password do not match" });
        }
      } else {
        res.send({ "status": "failed", "message": "All fields are required" });
      }
    }
  }

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password);
          if ((user.email === email) && isMatch) {
            const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, {expiresIn:'5d'})
            res.send({ "status": "success", "message": "Login success", "token": token });
          } else {
            res.send({ "status": "failed", "message": "Invalid email or password" });
          }
        } else {
          res.send({ "status": "failed", "message": "You are not a registered user" });
        }
      } else {
        res.send({ "status": "failed", "message": "All fields are required" });
      }
    } catch (error) {
      console.error('Error during user login:', error);
      res.status(500).send({ "status": "failed", "message": "Unable to login" });
    }
  }

  static changeUserPassword = async(req,res) => {
    const {password, password_confirmation} = req.body
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        res.send({ "status": "failed", "message": "New password and Confirm New password doesnt match" });

      } else{
        const salt = await bcrypt.genSalt(10)
        const newHashPassword = await bcrypt.hash(password, salt) 
        console.log(req.user)
        res.send({ "status": "success", "message": "Password changed succesfully" });

      }

    }else{
      res.send({ "status": "failed", "message": "All fields are required" });
    }
  }
}

export default UserController;
