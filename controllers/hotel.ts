import "dotenv/config";
import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { axiosInstance } from "../config/axios-instance";
import Booking from "../model/Booking";
import { getBasicHotelsInfo } from "../utils/helpers";
import mongoose from "mongoose";

export const getRoot: RequestHandler = (req, res, next) => {
  res.statusCode = 200;
  res.json("Test message from server");
};

// GET-> /search controller
export const getSearchHotels: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array() });
    return;
  }

  const { region_id, lat, lng } = req.query as { region_id?: string; lat?: string; lng?: string };

  try {
    let searchUrl = "/search/serp/region/";
    if (lat && lng) {
      searchUrl = "/search/serp/geo/";
    }

    const response = await axiosInstance.post(searchUrl, {
      checkin: new Date().toISOString().split("T")[0], // current date
      checkout: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0], // date in 7 day's time
      ...(region_id ? { region_id: parseInt(region_id) } : {}),
      ...(lat && lng ? { latitude: parseFloat(lat), longitude: parseFloat(lng), radius: 5000 /* 5km */ } : {}),
      currency: "USD",
      guests: [
        {
          adults: 1,
        },
      ],
    });

    res.status(200).json(getBasicHotelsInfo(response.data.data));
  } catch (err) {
    console.error(err.response.data || err);
    res.status(500).json({ error: err.response.data || err });
  }
};

// GET-> /hotels/:id controller
export const getHotelById: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array() });
    return;
  }

  const id = req.params.id;

  try {
    const response = await axiosInstance.post("/search/serp/hotels/", {
      checkin: new Date().toISOString().split("T")[0], // current date
      checkout: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0], // date in 7 day's time
      ids: [id],
      guests: [
        {
          adults: 1,
        },
      ],
    });

    res.status(200).json(getBasicHotelsInfo(response.data.data));
  } catch (err) {
    console.error(err.response.data || err);
    res.status(500).json({ error: err.response.data || err });
  }
};

// POST-> /book controller
export const postBookHotel: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array() });
    return;
  }

  const { search_hash, user, card, arrival_datetime } = req.body;

  // All bookings for the test hotel (use hid = 6291619or id = test_hotel_do_not_book)
  try {
    // Step 1: prebook rate from search step

    const prebookResponse = await axiosInstance.post("/serp/prebook/", {
      hash: search_hash,
    });

    const book_hash = prebookResponse.data.data.hotels[0].rates[0].book_hash;
    const bookingAmount = prebookResponse.data.data.hotels[0].rates[0].payment_options.payment_types.amount;

    // Step 2: create booking process
    const partner_order_id = new mongoose.Types.ObjectId();

    const createBookingResponse = await axiosInstance.post("/hotel/order/booking/form/", {
      partner_order_id: partner_order_id,
      book_hash: book_hash,
      language: "en",
      user_ip: req.ip,
    });

    const { order_id, res_partner_order_id, item_id, payment_types } = createBookingResponse.data.data;

    // Step 3: create credit card token
    const pay_uuid = new mongoose.Types.ObjectId();
    const init_uuid = new mongoose.Types.ObjectId();

    const paymentResponse = await axiosInstance.post(
      "https://api.payota.net/api/public/v1/manage/init_partners",
      {
        objectId: item_id,
        pay_uuid,
        init_uuid,
        user_first_name: user.first_name,
        user_last_name: user.last_name,
        cvc: card.cvc,
        is_cvc_required: true,
        credit_card_data_core: {
          year: card.year,
          card_number: card.number,
          card_holder: card.holder,
          month: card.month,
        },
      },
      { baseURL: "" }
    );

    // Step 4: start booking process
    const finishBookingResponse = await axiosInstance.post("/hotel/order/booking/finish/", {
      arrival_datetime: arrival_datetime,
      language: "en",
      partner: {
        partner_order_id,
      },
      payment_type: {
        type: "now",
        amount: bookingAmount,
        currency_code: "USD",
        init_uuid,
        pay_uuid,
      },
      upsell_data: {},
      rooms: [{ first_name: user.first_name, last_name: user.last_name }],
      user: {
        email: "adedokuntobiloba100@gmail.com",
        phone: "+2348146264116",
      },
    });

    // Step 5: store booking info in db
    const saved = await Booking.create({
      partner_order_id,
      order_id,
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
      },
      item_id,
      init_uuid,
      pay_uuid,
      status: "paid",
    });

    res.status(200).json({ message: "Booking successful", order_id });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: err.response.data || err });
  }
};

// // POST-> /payment controller (payment process already incorporated into /booking)

// POST-> /cancel/:bookingId controller
export const postCancelBookingById: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array() });
    return;
  }

  const bookingId = req.params.bookingId;

  try {
    const response = await axiosInstance.post("/hotel/order/cancel/", {
      partner_order_id: bookingId,
    });

    if (!response.data.error) {
      const booking = await Booking.findOneAndUpdate({ order_id: bookingId }, { status: "cancelled" }, { new: true });

      if (!booking) {
        res.status(404).json({ error: "Booking not found" });
        return;
      }

      res.status(201).json(response.data);
      return;
    }

    let statusCode = 201;
    if (response.data.error === "order_not_found") statusCode = 404;

    res.status(statusCode).json(response.data);
  } catch (err) {
    console.error(err.response.data || err);
    res.status(500).json({ error: err.response.data || err });
  }
};
