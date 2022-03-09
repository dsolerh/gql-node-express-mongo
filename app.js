const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const { config } = require("dotenv");
config()

const app = express();
app.use(express.json());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: require("./graphql/schema"),
    rootValue: require("./graphql/resolvers"),
    graphiql: true,
  })
);

mongoose
  .connect(
    process.env.MONGO_CONN.replace("<<user>>", process.env.MONGO_USER)
      .replace("<<password>>", process.env.MONGO_PASSWORD)
      .replace("<<dbname>>", process.env.MONGO_DB)
  )
  .then(() => {
    app.listen(process.env.APP_PORT || 3000);
    console.log("App started on port: ", process.env.APP_PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
