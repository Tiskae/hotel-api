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
  [
    body("search_hash", "search_hash is required").notEmpty(),
    body("arrrival_datetime", "arrival_datetime is required").notEmpty(),
    body("user.first_name", "user.first_name is required").notEmpty(),
    body("user.last_name", "user.last_name is required").notEmpty(),
    body("card.holder", "card.holder is required").notEmpty(),
    body("card.number", "card.number is required").notEmpty(),
    body("card.year", "card.year is required")
      .notEmpty()
      .isLength({ min: 2, max: 2 })
      .withMessage("card.year must be 2 characters long"),
    body("card.month", "card.month is required")
      .notEmpty()
      .isLength({ min: 2, max: 2 })
      .withMessage("card.month must be 2 characters long"),
    ,
    body("card.cvv", "card.cvv is required")
      .notEmpty()
      .isLength({ min: 3, max: 3 })
      .withMessage("card.cvv must be 3 characters long"),
    ,
  ],
  hotelControllers.postBookHotel
);

// // POST-> /payment (payment process already incorporated into /booking)
// hotelRoutes.post(
//   "/payment",
//   [body("userId", "user id is required").isString(), body("paymentId", "payment id is required").isString()],
//   hotelControllers.postPayment
// );

// POST-> /cancel/:bookingId
hotelRoutes.post(
  "/cancel/:bookingId",
  [
    param("bookingId")
      .exists()
      .withMessage("bookingId is required")
      .isString()
      .withMessage("bookingId must be a string"),
  ],
  hotelControllers.postCancelBookingById
);

export default hotelRoutes;
