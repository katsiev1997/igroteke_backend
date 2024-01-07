import Customer from '../models/customerModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const customerCtrl = {
  signup: async (req, res) => {
    try {
      const { phone, password, code } = req.body;
      if (phone.length != 10) {
        return res
          .status(400)
          .json({ message: 'Номер телефона должен содержать 10 цифр!' });
      }
      if (code != '00606') {
        return res.status(400).json({ message: 'Неверный код!' });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: 'Пароль не должен быть меньше 6 символов!' });
      }
      const customer = await Customer.findOne({ phone });
      if (customer) {
        return res.status(400).json({
          message: 'Пользователь с таким номером телефона уже существует!',
        });
      } else {
        const hashPassword = await bcrypt.hash(password, 8);
        const newCustomer = await Customer.create({
          phone,
          password: hashPassword,
        });
        return res
          .status(200)
          .json({ message: 'Вы успешно зарегистрировались!', newCustomer });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { phone, password } = req.body;
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: 'Пароль не должен быть меньше 6 символов!' });
      }
      const customer = await Customer.findOne({ phone });
      if (!customer) {
        return res.status(400).json({
          message: 'Пользователя с таким номером телефона не существует!',
        });
      } else {
        const isCorrect = await bcrypt.compare(password, customer.password);
        if (isCorrect) {
          const access_token = createAccessToken({ id: customer._id });
          const refresh_token = createRefreshToken({ id: customer._id });
          res.cookie('refreshToken', refresh_token, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: '/api/refresh_token',
            httpOnly: true,
          });
          return res.status(200).json({
            message: 'Вы успешно авторизовались!',
            customer: {
              id: customer._id,
              phone: customer.phone,
              booking: customer.booking,
            },
            access_token,
          });
        } else {
          return res.status(400).json({ message: 'Неверный пароль!' });
        }
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie('refreshToken', { path: '/api/refresh_token' });
      return res.status(200).json({ message: 'Logged out!' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  generateAccessToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshToken;
      if (!rf_token)
        return res.status(400).json({ message: 'Пожалуйста войдите' });

      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, result) => {
          if (err)
            return res.status(400).json({ message: 'Пожалуйста, войдите.' });
          const customer = await Customer.findById(result.id);

          if (!customer)
            return res
              .status(400)
              .json({ message: 'Такого пользователя не существует!' });

          const access_token = createAccessToken({ id: result.id });
          return res.json({
            access_token,
            customer,
          });
        }
      );
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '2h',
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '30d',
  });
};

export default customerCtrl;
