import http from 'http';
import app from './app';
import setupWebsocket from './config/websocket';

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);
export const websocket = setupWebsocket(server);

server.listen(port, () => console.log(`DooDoop listening on port ${port}!`))
