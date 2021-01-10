import socketIOClient from "socket.io-client";
const sockets = socketIOClient("http://52.172.195.253:5000/");
global.config = {
  backendURL: "http://52.172.195.253/api",
  images: "http://52.172.195.253:5000/",
  socket: sockets,
};
export default global.config;
