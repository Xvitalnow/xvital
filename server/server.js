import http from 'http';
import { app } from './app.js';

const server = http.createServer(app);
const PORT = process.env.PORT || 6000;

server.listen(PORT, ()=>{
    console.log(`Congratulations! Your server is running on port ${PORT}`);
})