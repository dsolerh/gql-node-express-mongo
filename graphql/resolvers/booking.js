const { toISOString } = require("../../helpers/date");
const Booking = require("../../models/booking.model");
const Event = require("../../models/event.model");
const User = require("../../models/user.models");
const { transformBooking, transformEvent } = require("./merge");

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Access denied");
    }
    const bookings = await Booking.find();
    return bookings.map(transformBooking);
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Access denied");
    }
    try {
      const event = await Event.findOne({ _id: args.eventId });
      if (!event) {
        throw new Error("Event not found");
      }
      const user = await User.findById(req.userId);
      if (!user) {
        throw new Error("User not found");
      }
      const booking = await Booking.create({
        event: event,
        user: user,
      });
      return transformBooking(booking);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Access denied");
    }
    const booking = await Booking.findByIdAndDelete(args.bookingId); // cambiar a otra forma de cancelacion
    if (!booking) {
      throw new Error("Booking not found");
    }
    const event = await Event.findById(booking.event);
    return transformEvent(event);
  },
};
