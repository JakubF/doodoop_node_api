import request from 'supertest';
import app from '../src/server';

const sendRequest = ({ endpoint = '/graphql', query, variables = {} }) => {
  return request(app)
    .post(endpoint)
    .send({ query, variables });
};

export default {
  sendRequest
};