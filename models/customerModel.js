import mongoose from 'mongoose'

const customerSchema = new mongoose.Schema({
  phone: { type: String, default: '', unique: true },
  password: { type: String, default: '' },
  booking: {
    type: {
      clubId: { type: mongoose.Types.ObjectId, ref: 'club' },
      room: String,
      from: Number,
      to: Number
    },
    default: null,
  },
})

export default mongoose.model('customer', customerSchema)
