import socketIOClient from "socket.io-client";
const sockets = socketIOClient(`http://localhost:5000/`);
global.config = {
  backendURL: "http://localhost:5000/api",
  socket: sockets,
};
export default global.config;
