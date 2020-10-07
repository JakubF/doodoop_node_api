import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
// GraphQL schema
const schema = buildSchema(`
    type Query {
        message: String
    }
`);
// Root resolver
const root = {
  message: () => 'Hello World!'
};
// Create an express server and a GraphQL endpoint
const graphql = graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
})
export default graphql;
