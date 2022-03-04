const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const events = [];
const app = express();
app.use(express.json());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      descrption: String!
      price: Float!
      date: String!
    }

    input EventInput {
      title: String!
      descrption: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: (args) => {
        const event = {
          _id: events.length,
          ...args.eventInput,
          date: new Date(args.eventInput.date).toISOString(),
        };
        events.push(event);
        return event;
      },
    },
    graphiql: true,
  })
);

app.listen(process.env.APP_PORT || 3000);
