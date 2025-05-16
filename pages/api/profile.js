// pages/api/profile.js
import { initMongoose } from '../../lib/mongoose';
import Profile from '../../models/Profile';



export default async function handler(req, res) {
  await initMongoose();

  // Tomamos el sub del usuario desde un header personalizado
  const userSub = req.headers['x-user-sub'];
  if (!userSub) {
    return res.status(401).json({ error: 'No autorizado: falta sub' });
  }

  if (req.method === 'GET') {
    const profile = await Profile.findOne({ sub: userSub }).lean();
    return res.status(200).json(profile || null);
  }

  if (req.method === 'POST') {
    const { name, email, address, postalCode } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const update = { name, email, address, postalCode, sub: userSub };
    // upsert: crea si no existe
    const profile = await Profile.findOneAndUpdate(
      { sub: userSub },
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    return res.status(200).json(profile);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
