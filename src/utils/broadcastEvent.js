import { websocket } from '../server'

const broadcastEvent = (eventName, payload) => {
  console.log("BROADCASTING " + eventName);
  websocket.emit(eventName, payload);
}

export default broadcastEvent;