import {model, models, Schema} from "mongoose";

const ProductSchema = new Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
  categoria: String,
  foto: String,
});

const Product = models?.Product || model('Product', ProductSchema);

export default Product;