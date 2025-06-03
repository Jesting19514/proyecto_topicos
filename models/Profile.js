
import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  sub:         { type: String, required: true, unique: true }, 
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  address:     { type: String },
  postalCode:  { type: String }
}, { timestamps: true });


export default mongoose.models.Profile ||
       mongoose.model('Profile', ProfileSchema);
