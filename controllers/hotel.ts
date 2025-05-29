import "dotenv/config";
import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { axiosInstance } from "../config/axios-instance";

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
      currency: "EUR",
      guests: [
        {
          adults: 1,
        },
      ],
    });
    console.log(response);
    res.status(200).json(response.data);
  } catch (err) {
    console.error(err.response.data || err);
    res.status(500).json(err.response.data || err);
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
      ids: [id], // econo_lodge_live_oak, quality_inn_live_oak
      guests: [
        {
          adults: 1,
        },
      ],
    });

    console.log(response);
    res.status(200).json(response.data);
  } catch (err) {
    console.error(err.response.data || err);
    res.status(500).json(err.response.data || err);
  }
};

export const postBookHotel: RequestHandler = (req, res) => {
  res.statusCode = 201;
  res.json("Book hotel successfully");
};

export const postPayment: RequestHandler = (req, res) => {
  res.statusCode = 201;
  res.json("Booking payment made successfully");
};

export const postCancelBookingById: RequestHandler = (req, res) => {
  res.statusCode = 201;
  res.json("Cancel booking with the id");
};
