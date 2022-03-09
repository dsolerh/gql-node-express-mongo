const Event = require("../../models/event.model");
const User = require("../../models/user.models");
const { toISOString } = require("../../helpers/date");
const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    const events = await Event.find();
    return events.map(transformEvent);
  },
  createEvent: async (args) => {
    try {
      const user = await User.findById("62218297db07ac2b51e71d4c");
      if (!user) {
        throw new Error("User not found");
      }

      const event = await Event.create({
        ...args.eventInput,
        date: toISOString(args.eventInput.date),
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
};
