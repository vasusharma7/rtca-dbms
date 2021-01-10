import socketIOClient from "socket.io-client";
const sockets = socketIOClient(`https://52.172.195.253:5000/`);
global.config = {
  backendURL: "https://52.172.195.253:5000/api",
  images: "https://52.172.195.253:5000/",
  socket: sockets,
};
export default global.config;
