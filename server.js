require('./connection');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');

const { typeDefs, resolvers } = require('./graphql');

const app = express();

// cors
app.use(cors());

// body parser middleware
app.use(express.json());

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: process.env.APOLLO_SERVER_PLAYGROUND || true,
  introspection: process.env.APOLLO_SERVER_INTROSPECTION || true,
});

apolloServer.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log('app is running...', apolloServer.graphqlPath);
});
