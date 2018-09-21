const express = require('express');
const siofu = require("socketio-file-upload");
const multer = require('multer');
const app = express();

server = app.listen(3001, function () {
  console.log('server listening on port 3001');
});

const io = require('socket.io')(server);
const irc = require('irc');

const fileFilter = function (req, file, cb) {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"]

  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Mauvais format")
    error.code = "LIMIT_FILE_TYPES"
    return cb(error, false)
  }
  cb(null, true)
}

const MAX_SIZE = 3000000
const upload = multer({
  dest: './uploads/',
  fileFilter,
  limits: {
    fileSize: MAX_SIZE
  }
})

let ircConf = {
  server: 'chat.freenode.net',
  globalChannel: '#conserto-reso-test'
};

let users = [];

app.use(function (err, req, res, next) {
  if (err.code === "LIMIT_FILE_TYPES") {
    res.status(422).json({ error: "Images et PDF uniquement autorisés" })
    return
  }
  if (err.code === "MAX_SIZE") {
    res.status(422).json({ error: `Fichier trop volumineux. La taille maximum est de ${MAX_SIZE / 1000} KB` })
    return
  }
})


io.on('connection', function (socket) {
  socket.emit('GET_NICKNAME');

  let client;

  socket.on('NICKNAME', function (nickname) {
    client = new irc.Client(ircConf.server, nickname, {
      autoConnect: false
    });

    client.nickname = nickname;

    client.addListener('error', function (message) {
      console.log('error: ', message)
    });

    client.connect(() => {
      client.join(ircConf.globalChannel, () => {
        client.addListener('message' + ircConf.globalChannel, function (author, content) {
          socket.emit('MESSAGE', {
            author: author,
            content: content
          });
        });

        socket.emit('CONNECTED');
      });
    });
  });

  socket.on('SAY', function (content) {
    if (client) {
      client.say(ircConf.globalChannel, content);
      socket.emit('MESSAGE', {
        author: client.nickname,
        content: content
      });
    }
  });

  app.post("/upload", upload.array('files'), (req, res) => {
    res.json({ files: req.files });
    console.log(files)
    client.say(ircConf.globalChannel, content);
    socket.emit('MESSAGE', {
      author: client.nickname,
      content: "Fichier envoyé"
    });
  })


  socket.on('disconnect', function () {
    client.part(ircConf.globalChannel, () => {
      client.disconnect();
    });
  });
});

let watchClient = new irc.Client(ircConf.server, 'bot_watch', {
  autoConnect: false
});

watchClient.addListener('error', function (message) {
  console.log('error: ', message)
});

watchClient.connect(() => {
  watchClient.join(ircConf.globalChannel, () => {
    watchClient.addListener('names' + ircConf.globalChannel, (nicknames) => {
      users = [];

      for (let nickname in nicknames) {
        if (nicknames.hasOwnProperty(nickname) && nickname !== 'bot_watch') {
          users.push({ nickname: nickname });
        }
      }

      io.emit("USER_LIST_UPDATE", users);
    });

    watchClient.addListener('join' + ircConf.globalChannel, () => {
      watchClient.send('NAMES', ircConf.globalChannel);
    });

    watchClient.addListener('part' + ircConf.globalChannel, () => {
      watchClient.send('NAMES', ircConf.globalChannel);
    });

    watchClient.addListener('kick' + ircConf.globalChannel, () => {
      watchClient.send('NAMES', ircConf.globalChannel);
    });

    watchClient.addListener('kill', () => {
      watchClient.send('NAMES', ircConf.globalChannel);
    });

    watchClient.addListener('quit', () => {
      watchClient.send('NAMES', ircConf.globalChannel);
    });
  });
});
