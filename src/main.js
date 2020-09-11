import express from 'express';
import { PubSub, ApolloServer } from 'apollo-server-express';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import cors from 'cors';

const app = express();
const pubsub = new PubSub();
dotenv.config();

app.use(cors());
app.use(express.json());

const apolloServer = new ApolloServer({
  typeDefs: mergeTypeDefs(loadFilesSync(path.join(__dirname, './typeDefs'))),
  resolvers: mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers'))),
  context: ({ req }) => ({ req, pubsub })
});

const httpServer = http.createServer(app);
apolloServer.applyMiddleware({ app });
apolloServer.installSubscriptionHandlers(httpServer);

const $PORT = process.env.PORT || 8080;
httpServer.listen($PORT, () => {
  console.log(
    `[ SUCCESS ] Graphql Server is Listening on http://localhost:${$PORT}${apolloServer.graphqlPath} 🚀`
  );
});
