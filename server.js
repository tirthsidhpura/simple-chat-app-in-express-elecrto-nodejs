const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);




app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))



var Message = mongoose.model('Message',{ name : String, message : String})

mongoose.connect('mongodb+srv://admin:admin@cluster0.ts3tmcu.mongodb.net/?retryWrites=true&w=majority')
.then(()=>console.log("db connected"))
.catch((err)=> console.log(err))



app.get("/",(req,res)=>{
  res.render('index.ejs')
})

app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
      res.send(messages);
    })
  })


  // app.post('/messages', (req, res) => {
  //   var message = new Message(req.body);
  //   message.save((err) =>{
  //     if(err)
  //       sendStatus(500);
  //     res.sendStatus(200);
  //   })
  // })

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
      if(err)
        sendStatus(500);
      io.emit('message', req.body);
      res.sendStatus(200);
    })
  })


  io.on('connection', () =>{
    console.log('a user is connected')
   })

   
var server = http.listen(3001, () => {
    console.log('server is running on port', server.address().port);
  });

// app.listen("3001",(req,res)=>{
//     console.log("server started");
// })