import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import doodoopGraphql from '../graphql';

let schema = '';
const root = {};
// GraphQL schema
Object.keys(doodoopGraphql).forEach((resourceName) => {
  schema = `${schema}\n${doodoopGraphql[resourceName].schema}`;
  root[resourceName] = doodoopGraphql[resourceName].resolver;
});
const doodoopSchema = buildSchema(`
    ${schema}
    type Query {
        message: String,
        gameSessions(id: Int, name: String, status: String, enterCode: String): [GameSessions],
        roundElements(id: Int, name: String, status: String, answer: String, points: Int, gameSessionId: Int): [RoundElements],
    }
`);
// Create an express server and a GraphQL endpoint
const graphql = graphqlHTTP({
  schema: doodoopSchema,
  rootValue: root,
  graphiql: true
})
export default graphql;
