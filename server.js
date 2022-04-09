const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');
const { typeDefs, resolvers } = require('./graphql');

// set env variables
dotEnv.config();

const app = express();

// cors
app.use(cors());

// body parser middleware
app.use(express.json());

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
});

apolloServer.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log('app is running...', apolloServer.graphqlPath);
});
