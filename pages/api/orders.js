import { initMongoose } from '../../lib/mongoose';
import Order from '../../models/Order';

export default async function handler(req, res) {
  await initMongoose();

  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
