import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema({
  phoneNumber: { type: String, default: '', unique: true },
  password: { type: String, default: '' },
  clubId: { type: mongoose.Types.ObjectId, ref: 'club', default: '' },
  booking: {
    type: [{
      clubId: { type: mongoose.Types.ObjectId, ref: 'club', default: '' },
      room: { type: String, default: '' },
      timeSlots: { type: [Number], default: [] },
    }],
    default: [],
  },
})

export default mongoose.model('admin', adminSchema)
