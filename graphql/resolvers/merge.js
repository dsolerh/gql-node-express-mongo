const User = require("../../models/user.models");
const Event = require("../../models/event.model");
const { toISOString } = require("../../helpers/date");

const getUser = async (userId) => {
  const user = await User.findById(userId);
  return transformUser(user);
};

const getEvents = async (eventIds) => {
  const events = await Event.find({ _id: { $in: eventIds } });
  return events.map(transformEvent);
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
  date: toISOString.bind(this, event.date),
  creator: getUser.bind(this, event.creator),
});

const transformBooking = (booking) => ({
  ...booking._doc,
  user: getUser.bind(this, booking.user),
  event: getEvent.bind(this, booking.event),
  createdAt: toISOString.bind(this, booking.createdAt),
  updatedAt: toISOString.bind(this, booking.updatedAt),
});

module.exports = {
  transformBooking,
  transformUser,
  transformEvent,
};
