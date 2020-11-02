import socketIOClient from "socket.io-client";
const sockets = socketIOClient(`http://18.225.11.191:5001/`);
global.config = {
  backendURL: "http://18.225.11.191:5001/api",
  images: "http://18.225.11.191:5001/",
  socket: sockets,
};
export default global.config;
