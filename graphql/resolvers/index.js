const bcrypt = require("bcrypt");

const Event = require("../../models/event.model");
const User = require("../../models/user.models");
const Booking = require("../../models/booking.model");

const getUser = async (userId) => {
  const user = await User.findById(userId);
  return transformUser(user);
};

const getEvents = async (eventIds) => {
  const events = await Event.find({ _id: { $in: eventIds } });
  return events.map((event) => transformEvent.bind(this, event));
};

const getEvent = async (eventId) => {
  const event = await Event.findById(eventId);
  return transformEvent(event);
};

const transformUser = (user) => ({
  ...user._doc,
  password: null,
  createdEvents: getEvents.bind(this, user.createdEvents),
});

const transformEvent = (event) => ({
  ...event._doc,
  date: toDateString.bind(this, event.date),
  creator: getUser.bind(this, event.creator),
});

const transformBooking = (booking) => ({
  ...booking._doc,
  user: getUser.bind(this, booking.user),
  event: getEvent.bind(this, booking.event),
  createdAt: toDateString.bind(this, booking.createdAt),
  updatedAt: toDateString.bind(this, booking.updatedAt),
});

const toDateString = (date) => new Date(date).toISOString();

module.exports = {
  events: async () => {
    const events = await Event.find();
    return events.map(transformEvent);
  },
  users: async () => {
    const users = await User.find();
    return users.map(transformUser);
  },
  bookings: async () => {
    const bookings = await Booking.find();
    return bookings.map(transformBooking);
  },
  createEvent: async (args) => {
    try {
      const user = await User.findById("62218297db07ac2b51e71d4c");
      if (!user) {
        throw new Error("User not found");
      }

      const event = await Event.create({
        ...args.eventInput,
        date: new Date(args.eventInput.date).toISOString(),
        creator: "62218297db07ac2b51e71d4c",
      });

      user.createdEvents.push(event._id);
      await user.save();

      return transformEvent(event);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  createUser: async (args) => {
    try {
      if ((await User.findOne({ email: args.userInput.email })) != null) {
        throw new Error("User already exist");
      }
      const user = await User.create({
        ...args.userInput,
        password: await bcrypt.hash(args.userInput.password, 12),
      });
      return transformUser(user);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  bookEvent: async (args) => {
    try {
      const event = await Event.findOne({ _id: args.eventId });
      if (!event) {
        throw new Error("Event not found");
      }
      const user = await User.findById("62218297db07ac2b51e71d4c");
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
  cancelBooking: async (args) => {
    const booking = await Booking.findByIdAndDelete(args.bookingId); // cambiar a otra forma de cancelacion
    if (!booking) {
      throw new Error("Booking not found")
    }
    const event = await Event.findById(booking.event);
    return transformEvent(event);
  },
};
