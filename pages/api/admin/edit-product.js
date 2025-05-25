import { initMongoose } from '../../../lib/mongoose';
import Product from '../../../models/Product';

export default async function handler(req, res) {
  await initMongoose();
  const { method } = req;

  if (method === 'POST') {
    const { nombre, descripcion, precio, categoria, foto } = req.body;
    if (!nombre || !descripcion || !precio || !categoria || !foto) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const newProduct = await Product.create({ nombre, descripcion, precio, categoria, foto });
    return res.status(201).json(newProduct);
  }

  if (method === 'PUT') {
    const { _id, nombre, descripcion, precio, categoria, foto } = req.body;
    if (!_id || !nombre || !descripcion || !precio || !categoria || !foto) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const updated = await Product.findByIdAndUpdate(
      _id,
      { nombre, descripcion, precio, categoria, foto },
      { new: true }
    );
    return res.status(200).json(updated);
  }

  if (method === 'DELETE') {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ error: 'Falta el ID del producto' });
    }
    await Product.findByIdAndDelete(_id);
    return res.status(204).end();
  }

  res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
  res.status(405).end(`Método ${method} no permitido`);
}
