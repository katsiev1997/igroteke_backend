import Club from '../models/clubModel.js';

const clubCtrl = {
  create: async (req, res) => {
    try {
      const { phone, name, address, roomsNumber, code } = req.body;
      if (code != '468199') {
        return res.status(400).json({ message: 'Неверный код!' });
      }
      if (phone.length != 10) {
        return res
          .status(400)
          .json({ message: 'Номер телефона должен содержать 10 цифр!' });
      }
      if (name.length < 3) {
        return res
          .status(400)
          .json({ message: 'Название не может быть короче 3 символов' });
      }
      if (Number(roomsNumber) > 20) {
        return res
          .status(400)
          .json({ message: 'Мест не может быть больше 25' });
      }
      const club = await Club.findOne({ phone });
      if (club) {
        return res.status(400).json({
          message: 'Клуб с таким номером телефона уже существует!',
        });
      }
      const club1 = await Club.findOne({ name });
      if (club1) {
        return res.status(400).json({
          message: 'Клуб с таким названием уже существует!',
        });
      }
      const rooms = [];
      for (let i = 1; i <= roomsNumber; i++) {
        rooms.push({ name: i });
      }
      const newClub = await Club.create({
        phone,
        name,
        address,
        roomsNumber,
        rooms,
      });
      return res.status(200).json({
        message: 'Клуб успешно зарегистрирован!',
        clubId: newClub._id,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  get_clubs: async (req, res) => {
    try {
      const clubs = await Club.find();
      return res.status(200).json(clubs);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

export default clubCtrl;
