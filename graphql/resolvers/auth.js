const { compare } = require("bcrypt");
const { hash } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const User = require("../../models/user.models");
const { transformUser } = require("./merge");

module.exports = {
  users: async () => {
    const users = await User.find();
    return users.map(transformUser);
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    if (!(await compare(password, user.password))) {
      throw new Error("Invalid Credentials");
    }

    const token = sign(
      { userId: user.id, email: user.email },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    return {
      userId: user.id,
      token,
      tokenExpiration: 1,
    };
  },
  createUser: async (args) => {
    try {
      if ((await User.findOne({ email: args.userInput.email })) != null) {
        throw new Error("User already exist");
      }
      const user = await User.create({
        ...args.userInput,
        password: await hash(args.userInput.password, 12),
      });
      return transformUser(user);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
