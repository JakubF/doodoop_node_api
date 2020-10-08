import socketio from 'socket.io';

const setupWebsocket = (serverInstance) => {
  const websocket = socketio(serverInstance, {
    handlePreflightRequest: (req, res) => {
      const headers = {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'http://localhost:8080'
      };
      res.writeHead(200, headers);
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.end();
    }
  });

  websocket.on('connection', (socket) => {
    console.log(`Socket: ${socket.client.id} connected`);
  });

  return websocket;
}

export default setupWebsocket;