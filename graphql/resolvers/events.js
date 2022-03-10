const Event = require("../../models/event.model");
const User = require("../../models/user.models");
const { toISOString } = require("../../helpers/date");
const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    const events = await Event.find();
    return events.map(transformEvent);
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Access denied")
    }
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        throw new Error("User not found");
      }

      const event = await Event.create({
        ...args.eventInput,
        date: toISOString(args.eventInput.date),
        creator: user,
      });

      user.createdEvents.push(event._id);
      await user.save();

      return transformEvent(event);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
