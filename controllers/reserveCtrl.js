import Club from '../models/clubModel.js';
import Customer from '../models/customerModel.js';

const reserveCtrl = {
  create: async (req, res) => {
    try {
      const { idCustomer, idClub, roomNum } = req.body;
      let { from, to } = req.body;
      from = Number(from);
      to = Number(to) + 1;
      const room = Number(roomNum);
      const club = await Club.findById(idClub);
      const customer = await Customer.findById(idCustomer);
      if (customer.booking != null) {
        return res.status(400).json({ message: 'У вас уже есть бронь!' });
      }
      if (
        !club ||
        !club.rooms ||
        !club.rooms[room] ||
        !club.rooms[room].availableTimeSlots
      ) {
        return res
          .status(400)
          .json({ message: 'Неверные данные клуба или комнаты!' });
      }
      for (let i = from; i < to; i++) {
        if (!club.rooms[room].availableTimeSlots[i]) {
          return res
            .status(400)
            .json({ message: 'Выбранное время уже забронировано' });
        }
      }
      for (let i = from; i < to; i++) {
        club.rooms[room].availableTimeSlots[i] = false;
      }
      club.rooms[room].bookings.push({
        customerId: idCustomer,
        from,
        to,
      });
      customer.booking = {
        clubId: idClub,
        room: roomNum,
        from,
        to,
      };
      await customer.save();
      await club.save();
      return res.status(200).json({ message: 'Время успешно забронировано' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const { idCustomer } = req.body;
      const customer = await Customer.findById(idCustomer);
      if (customer.booking == null) {
        return res.status(404).json({ message: 'У вас нет брони' });
      } else {
        const { clubId, room, from, to } = customer.booking;
        const roomNum = Number(room);
        const club = await Club.findById(clubId);
        for (let i = from; i < to; i++) {
          club.rooms[roomNum].availableTimeSlots[i] = true;
        }
        const bookingIndex = club.rooms[roomNum].bookings.findIndex(
          (booking) => booking.customerId === idCustomer
        );
        club.rooms[roomNum].bookings.splice(bookingIndex, 1);
        customer.booking = null;
        await customer.save();
        await club.save();
        return res.status(200).json({ message: 'Бронь успешно удалена' });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

export default reserveCtrl;
