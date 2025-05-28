import { Router } from "express";
import { body } from "express-validator";
import * as hotelControllers from "../controllers/hotel";

const hotelRoutes = Router();

// GET-> /
hotelRoutes.get("/", hotelControllers.getRoot);

// GET-> /search
hotelRoutes.get("/search", hotelControllers.getSearchHotels);

// GET-> /hotels/:id
hotelRoutes.get("/hotels/:id", hotelControllers.getHotelById);

// POST-> /book
hotelRoutes.post(
  "/book",
  [body("userId", "user id is required").isString(), body("hotelId", "hotel id is required").isString()],
  hotelControllers.postBookHotel
);

// POST-> /payment
hotelRoutes.post(
  "/payment",
  [body("userId", "user id is required").isString(), body("paymentId", "payment id is required").isString()],
  hotelControllers.postPayment
);

// POST-> /cancel/:bookingId
hotelRoutes.post("/cancel/:bookingId", hotelControllers.postCancelBookingById);

export default hotelRoutes;
