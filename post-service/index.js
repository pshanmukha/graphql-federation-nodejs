import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const posts = [
  {
    id: 1,
    title: "First Post",
    content: "This is the first post.",
    authorId: 1,
  },
  {
    id: 2,
    title: "Second Post",
    content: "This is the second post.",
    authorId: 2,
  },
  {
    id: 3,
    title: "Third Post",
    content: "This is the third post.",
    authorId: 1,
  },
];

const typeDefs = gql`
  type Post @key(fields: "id") {
    id: ID!
    title: String!
    content: String!
    author: User!
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    posts: [Post]
  }

  type Query {
    getPost(id: ID!): Post
    allPosts: [Post]
  }
`;

const resolvers = {
  Query: {
    getPost: (_, args) => {
      const { id } = args;
      const postId = parseInt(id);
      if (isNaN(postId)) {
        throw new Error("Invalid post ID");
      }
      const post = posts.find((post) => post.id === postId);
      if (!post) {
        throw new Error("Post not found");
      }
      return post;
    },
    allPosts: (_, args) => {
      return posts;
    },
  },
  Post: {
    author(post) {
      return { __typename: "User", id: post.authorId };
    },
  },
  User: {
    posts(user) {
      return posts.filter((post) => post.authorId === parseInt(user.id));
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server
  .listen({ port: 4002 })
  .then(({ url }) => {
    console.log(`Post service running at ${url}`);
  })
  .catch((err) => {
    console.error("Failed to start server", err);
  });
