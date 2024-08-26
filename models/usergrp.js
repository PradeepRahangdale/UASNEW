import mongoose from 'mongoose';

// Defining schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String,  required: true, trim: true }
  
});

// Model
const UserModel = mongoose.model('user', userSchema);

export default UserModel;
