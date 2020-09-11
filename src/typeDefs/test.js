import { gql } from 'apollo-server-express';

module.exports = gql`
  type Query {
    posts: Int!
  }
`;
