import { Router } from "express";
import { body, query, oneOf, param } from "express-validator";
import * as hotelControllers from "../controllers/hotel";

const hotelRoutes = Router();

// GET-> /
hotelRoutes.get("/", hotelControllers.getRoot);

// GET-> /search
hotelRoutes.get(
  "/search",
  [
    oneOf(
      [
        query("region_id", "region id must not be empty").notEmpty(),
        [query("lat", "longitude is required").notEmpty(), query("lng", "longitude is required").notEmpty()],
      ],
      { message: "Provide either a region id or both lat and lng" }
    ),
  ],
  hotelControllers.getSearchHotels
);

// GET-> /hotels/:id
hotelRoutes.get(
  "/hotels/:id",
  [param("id").exists().withMessage("Hotel id is required").isString().withMessage("Hotel id must be a string")],
  hotelControllers.getHotelById
);

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
