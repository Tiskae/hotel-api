🏨 Hotel Booking API
This is a RESTful API for searching, booking, paying for, and cancelling hotels using the RateHawk API. It also integrates MongoDB to store key booking information.

📌 Base URL: https://hotel-api-v1-3e9c6b5b0390.herokuapp.com/

📖 Available Endpoints

- GET /search
  Search for hotels by region ID or coordinates.
  Query Parameters (Required: one of the two)
  region_id (string)
  Example: ?region_id=12345
  lat (string) and lng (string)
  Example: ?lat=37.7749&lng=-122.4194

Success (200)

```JSON
{
  "data": {
      "hotels": [...]
  }
}
```

Error (4XX, 5XX)

```JSON
{
  "error": {...}
}
```

GET /hotels/{id}
Fetch a hotel by its unique ID.
URL Parameter
id (string)

Success (200)

```JSON
{
  "data": {
     "hotels": [...]
  }
}
```

Not found (404)

```JSON
{
  "data": {
     "hotels": []
  }
}
```

URL Parameter
booking_id (string)

POST /cancel/{booking_id}
Cancel a previously made booking.
URL Parameter
booking_id (string)

Success (200)

```JSON
{
  "data": {...}
}
```

Booking not found (404)

```
JSON
{
  "error": "order_not_found",
  ...
}
```

POST /book (Not working fully)
Book a hotel directly with card details. Not implemented fully 😓.
Request Body

```JSON
{
  "search_hash": "string",
  "arrival_datetime": "YYYY-MM-DD",
  "user": {
    "first_name": "string",
    "last_name": "string"
  },
  "card": {
    "holder": "string",
    "number": "string",       // 16 digits
    "year": "string",         // 2 digits
    "month": "string",        // 2 digits
    "cvv": "string"           // 3 digits
  }
}
```
