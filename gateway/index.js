import { ApolloServer } from "apollo-server";
import { ApolloGateway } from "@apollo/gateway";

const gateway = new ApolloGateway({
  serviceList: [
    { name: "user", url: "http://localhost:4001" },
    {
      name: "post",
      url: "http://localhost:4002",
    },
  ],
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
});

server
  .listen({ port: 4000 })
  .then(({ url }) => {
    console.log(`Gateway running at ${url}`);
  })
  .catch((err) => {
    console.error("Failed to start server", err);
  });
