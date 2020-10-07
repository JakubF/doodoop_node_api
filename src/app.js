import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import './config/environment.js';
import graphql from './config/graphql.js';

const app = express();

const whiteList = [process.env.FRONTEND_URL || 'http://localhost:8080'];
const corsOptions = {
  origin(origin, callback) {
    if (whiteList.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(
  morgan('@-- :date[web] -- METHOD_ :method -- URL_ :url -- STATUS_ :status -- RESPONSE_ :response-time[digits]ms')
);
app.use('/graphql', graphql);

export default app;
