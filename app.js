const express = require('express')
const http = require('http');
const socketIO = require('socket.io');
const app = express()
const spawn = require('child_process').spawn;

const port = 4000

const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" }});

// 숫자의 합과, 숫자가 어디까지 왔는지 count를 정의합니다.
let sum = 0;
let count = 0;

// socket.io로 클라이언트와 실시간 통신을 합니다.
io.on('connection', socket => {

  // 1초마다 클라이언트에 통신을 보내줄 interval 함수를 할당하기 위해 선언을 합니다.
  let interval;

  console.log("connect client by Socket.io"); 

  // 클라이언트에서 start로 emit했을 때(start or resume 눌렀을 때)
  socket.on("start", req => {
    
    // 만약 초기 시작이 아닌 resume일 경우, 현재 number은 0이 아니므로, 따로 할당
    if (req.curNum !== 0) count = req.curNum;
    
    // 1초마다 클라이언트에게 현재 합의 정보를 보내줍니다.
    interval = setInterval(() => {

      // 100까지 완료한 경우에는 동작을 멈추고, 클라이언트에 end: true라는 값을 추가로 실어서 보냅니다.
      if (count === 100) {
        clearInterval(interval);
        socket.emit("start", { output: sum, curNum: count, end: true })
      }

      // count는 하나씩 늘어납니다.
      count++
      
      // 파이썬 비즈니스 로직을 호출하기 위해 child_process 모듈을 이용해서 sum, count의 인자를 전달합니다.
      const logic = spawn('python', ['./src/pythonLogic/logic.py', sum, count]); 

      // 파이썬 로직에서 결과를 얻은 값을 바탕으로 클라이언트에 해당 값을 보내줍니다.
      logic.stdout.on('data', (result) => { 
        sum = Number(result.toString());
        console.log(result.toString())
        socket.emit("start", { output: sum, curNum: count }); 
      });
    }, 1000);
  });
  
  // pause 요청이 왔을 때, Interval 함수를 중단합니다. (일시정지)
  socket.on("pause", () => {
    console.log('pause');
    clearInterval(interval);
  })
  
  // cancel 요청이 왔을 때, Interval 함수를 취소합니다. (초기화)
  socket.on("cancel", () => {
    console.log('cancel');
    clearInterval(interval);

    // 변수를 모두 0으로 초기화합니다.
    sum = 0;
    count = 0;
    socket.emit("cancel", { output: sum, curNum: count }); 
  })
  
  socket.on('disconnect', () => {
    console.log('Disconnect');
  });
});


server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})