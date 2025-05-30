import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  partner_order_id: String,
  order_id: String,
  user: {
    first_name: String,
    last_name: String,
  },
  item_id: String,
  init_uuid: mongoose.Types.ObjectId,
  pay_uuid: mongoose.Types.ObjectId,
  status: { type: String, enum: ["booked", "paid", "cancelled"], default: "booked" },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Booking", bookingSchema);
