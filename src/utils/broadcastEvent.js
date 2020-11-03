import { websocket } from '../server'

export const broadcastEvent = (eventName, payload) => {
  console.log("BROADCASTING " + eventName);
  websocket.emit(eventName, payload);
}