// models/Profile.js
import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  sub:         { type: String, required: true, unique: true }, // el identificador de Auth0
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  address:     { type: String },
  postalCode:  { type: String }
}, { timestamps: true });

// Evita recompilar el modelo en hot-reloads
export default mongoose.models.Profile ||
       mongoose.model('Profile', ProfileSchema);
