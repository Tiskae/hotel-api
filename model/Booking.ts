import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  offer_id: String,
  order_id: String,
  user: {
    first_name: String,
    last_name: String,
    email: String,
    phone: String,
  },
  guests: [
    {
      first_name: String,
      last_name: String,
    },
  ],
  status: { type: String, enum: ["booked", "paid", "cancelled"], default: "booked" },
  payment_link: String,
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
