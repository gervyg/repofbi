const express = require('express')
const agentes = require('./data/agentes.js')
const app = express()
const axios = require('axios')
const jwt = require('jsonwebtoken')

const secretKey = 'clave'


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.get('/SignIn', (req, res) => {   
    const { email, password } = req.query;   
    const user = (agentes.results).find((u) => u.email == email && u.password ==  password);
  
    if (user) {  
    const token = jwt.sign( {exp: Math.floor(Date.now() / 1000) + 120, data: user, },
    secretKey
    );
 
    res.send(`<a href="/Dashboard?token=${token}"> <p> Ir al Dashboard </p> </a>
    Bienvenido, ${email}.
    <script>
    localStorage.setItem('token', JSON.stringify("${token}"))
    </script>
    `);
    } else {   
    res.send("Usuario o contraseña incorrecta");
    }
    });

    
app.get("/Dashboard", (req, res) => {
 
    let { token } = req.query; 
    jwt.verify(token, secretKey, (err, decoded) => {   
    err
    ? res.status(401).send({
    error: "401 Unauthorized",
    message: err.message,
    })
    : 
    res.send(` Bienvenido al Dashboard ${decoded.data.email}`);
    });
    });

  

    app.listen(3000, () => console.log('Sevidor ON en puerto 3000'))

    