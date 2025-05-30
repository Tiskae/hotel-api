export const getBasicHotelsInfo = (responseData) => {
  const hotels = responseData.hotels;

  return {
    data: {
      total_hotels: responseData.total_hotels,
      hotels: hotels.map((hotel) => {
        return {
          id: hotel.id,
          hid: hotel.hid,
          rates: hotel.rates.map((r) => {
            return {
              room_name: r.room_name,
              daily_prices: r.daily_prices,
            };
          }),
        };
      }),
    },
  };
};
