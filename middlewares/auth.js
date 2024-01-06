import Customer from '../models/customerModel.js' 
import jwt from 'jsonwebtoken'

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(400).json({ msg: "Вы не авторизованы." });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded)
      return res.status(400).json({ msg: "Необходимо авторизоваться." });

    const customer = await Customer.findOne({ _id: decoded.id });
    req.body.idCustomer = customer._id;
    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
