require('./connection');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const path = require('path');

const { typeDefs, resolvers } = require('./graphql');
const { loaders } = require('./loaders/index');
const { authMiddleware, userLogMiddleware } = require('./middlewares/index');
const { makeExecutableSchema } = require('graphql-tools');
const { applyMiddleware } = require('graphql-middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(userLogMiddleware);

require('./rest-api/routes')(app);

const executableSchema = makeExecutableSchema({ typeDefs, resolvers });
const protectedSchema = applyMiddleware(executableSchema, authMiddleware);

const apolloServer = new ApolloServer({
  schema: protectedSchema,
  typeDefs,
  resolvers,
  debug: process.env.APOLLO_SERVER_DEBUG || true,
  playground: process.env.APOLLO_SERVER_PLAYGROUND || true,
  introspection: process.env.APOLLO_SERVER_INTROSPECTION || true,
  formatError: (err) => {
    return err;
  },
  formatResponse: (response, requestContext) => {
    if (requestContext.response && requestContext.response.http) {
      requestContext.response.http.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      requestContext.response.http.headers.set('Pragma', 'no-cache');
      requestContext.response.http.headers.set('Expires', '0');
      requestContext.response.http.headers.set('X-Content-Type-Options', 'nosniff');
    }

    return response;
  },
  context: (req) => ({
    req: req.req,
    loaders: loaders(),
  }),
});

apolloServer.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log('app is running...', apolloServer.graphqlPath);
});
