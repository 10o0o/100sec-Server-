const express = require('express')
const http = require('http');
const router = require('./src/route')
const socketIO = require('socket.io');
const app = express()
const spawn = require('child_process').spawn;

const port = 4000
app.use(router);

const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" }});

let sum = 0;

io.on('connection', socket => {
  let count = 0;
  let interval;
  console.log('User connected', socket.id);
  console.log("connect client by Socket.io"); 
  socket.on("start", req => {
    if (req.curNum !== 0) count = req.curNum;
    const logic = spawn('python', ['./src/pythonLogic/logic.py', '카레유', '20']); 
    logic.stdout.on('data', (result) => { 
      console.log(result.toString()); 
    });

    interval = setInterval(() => {
      // 99까지
      if (count === 9) clearInterval(interval);

      console.log('output: ', req.output, 'count: ', count);
      count++;
      sum += count
      socket.emit("start", { output: sum, curNum: count }); 
    }, 1000);
  });

  socket.on("pause", () => {
    console.log('pause');
    clearInterval(interval);
  })

  socket.on("cancel", () => {
    console.log('cancel');
    clearInterval(interval);
    sum = 0;
    socket.emit("cancel", { output: sum, curNum: 0 }); 
  })

  socket.on('disconnect', () => {
    console.log('Disconnect');
  });
});


server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})