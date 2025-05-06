const express = require("express");
const http = require("http");

const app = express();

const server = http.createServer(app);  

const ejs = require("ejs");
const path = require('path');
const socetIO = require('socket.io');
const { Socket } = require("dgram");

const io = socetIO(server)

app.use(express.static(path.join(__dirname,'public')));

app.set('view', path.join(__dirname, 'public'));

app.engine('html', ejs.renderFile);

app.use('/', (req,res)=>{
    res.render('indes.html')
})

// LÓDICA DO SOCKET.IO - ENVIO DE PROPAGAÇÃO DE MENSAGENS

//array que simula o branco de dados:
let messages = [];

//ESTRUTURA DE CONEXÃO DO SOCKET.IO
io.on('connection', socket=>{

    //teste de conexão
    console.log('NOVO USUÁRIO CONECTADO: ' + socket.id)

    //Recupera e mantém (exibe) as mensagens entre o front e o back:
    socket.emit('previousMessage', messages);

    //Lógica de chat quando uma mensagem é enviada:
    socket.on('sendMessage', data=>{
        //adiciona a mensagem no ginal do array de menssagens:
        messages.push(data);

        socket.broadcast.emit('receivedMessage', data);

        console.log('QTD MENSAGENS: '+messages.length)
    });

    console.log('QTD MENSAGENS: '+messages.length)
})

server.listen(3000, ()=>{console.log("chat rodando em http://localhost:3000")});