import "dotenv/config";
import { RequestHandler } from "express";

export const getRoot: RequestHandler = (req, res, next) => {
  res.statusCode = 200;
  res.json("Test message from server");
};

export const getSearchHotels: RequestHandler = (req, res, next) => {
  res.statusCode = 200;
  res.json("Test message from hotel route");
};

export const getHotelById: RequestHandler = (req, res, next) => {
  res.statusCode = 200;
  res.json("Search result lists of hotels");
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
