import socketIOClient from "socket.io-client";
const sockets = socketIOClient("http://streax.vasusharma.me:5000/");
global.config = {
  backendURL: "http://streax.vasusharma.me/api",
  images: "http://streax.vasusharma.me:5000/",
  socket: sockets,
};
export default global.config;
