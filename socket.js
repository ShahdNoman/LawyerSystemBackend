const socketIo = require('socket.io');

function setupSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    // 1. إدارة الغرف
    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log('User joined room:', room);
        // إرسال قائمة المستخدمين المتواجدين بالغرفة
      const usersInRoom = Array.from(io.sockets.adapter.rooms.get(room) || []).filter((id) => id !==socket.id);
      io.to(socket.id).emit('usersInRoom', usersInRoom);
      // إعلام المستخدمين الآخرين بانضمام مستخدم جديد
         socket.to(room).emit('newUserJoined', socket.id);
    });

    socket.on('leaveRoom', (room) => {
        socket.leave(room);
         console.log('User leaved room:', room);
       socket.to(room).emit('userLeft', socket.id);
    });

       // 2. إدارة الصوت والفيديو ومشاركة الشاشة
    socket.on('video-stream', (data) => {
      socket.to(data.room).emit('video-stream', {userId:socket.id, data:data.data});
    });

    socket.on('voice-stream', (data) => {
     socket.to(data.room).emit('voice-stream',{userId:socket.id, data:data.data});
    });

    socket.on('screen-stream', (data) => {
        socket.to(data.room).emit('screen-stream', {userId:socket.id, data:data.data});
    });

     // 3. إدارة الدردشة
    socket.on('chatMessage', (data) => {
        socket.to(data.room).emit('chatMessage', {userId:socket.id,message:data.message});
    });

      // 4. إدارة رفع اليد
    socket.on('raiseHand', (data) => {
       socket.to(data.room).emit('raiseHand',{userId:socket.id,isRaised:data.isRaised});
    });

      // 5. إدارة المشاركين (يمكن إضافة المزيد من الميزات لاحقاً)
    socket.on('muteUser', (data) => {
        socket.to(data.room).emit('muteUser',{userId:socket.id,isMuted:data.isMuted});
    });

      socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
         io.sockets.adapter.rooms.forEach((value, key) => {
          socket.to(key).emit('userLeft', socket.id);
           console.log('rooms',key);
         });
    });
  });
}

module.exports = setupSocket;