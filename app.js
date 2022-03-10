const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const http = require("http");
const { isAuth } = require("./middlewares/auth");
const { config } = require("dotenv");
config();

const app = express();
app.use(express.json());
app.use(isAuth);
app.use(
  "/graphql",
  graphqlHTTP({
    schema: require("./graphql/schema"),
    rootValue: require("./graphql/resolvers"),
    graphiql: true,
  })
);

const port = process.env.APP_PORT || 3000;
const server = http.createServer(app);
server.on("error", (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
});
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

mongoose
  .connect(
    process.env.MONGO_CONN.replace("<<user>>", process.env.MONGO_USER)
      .replace("<<password>>", process.env.MONGO_PASSWORD)
      .replace("<<dbname>>", process.env.MONGO_DB)
  )
  .then(() => {
    server.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
