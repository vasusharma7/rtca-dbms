import socketIOClient from "socket.io-client";
const sockets = socketIOClient("https://streax.vasusharma.me:5000/");
global.config = {
  backendURL: "https://streax.vasusharma.me/api",
  images: "https://streax.vasusharma.me:5000/",
  socket: sockets,
};
export default global.config;
