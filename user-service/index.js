import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const users = [
  { id: 1, name: "Alice", age: 30 },
  { id: 2, name: "Bob", age: 28 },
  { id: 3, name: "Charlie", age: 22 },
];

const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    name: String!
    age: Int!
  }
  type Query {
    getUser(id: ID!): User
    allUsers: [User]
  }
`;

const resolvers = {
  Query: {
    getUser: (_, args) => {
      const { id } = args;
      const userId = parseInt(id);
      if (isNaN(userId)) {
        throw new Error("Invalid user ID");
      }
      const user = users.find((user) => user.id === userId);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },
    allUsers: () => {
      return users;
    },
  },
  User: {
    __resolveReference(user, { id }) {
      const userId = parseInt(user.id);
      if (isNaN(userId)) {
        throw new Error("Invalid user ID");
      }
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server
  .listen({ port: 4001 })
  .then(({ url }) => {
    console.log(`User service running at ${url}`);
  })
  .catch((err) => {
    console.error("Failed to start server", err);
  });
