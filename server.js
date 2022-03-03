const express = require('express')
const agentes = require('./data/agentes.js')
const app = express()
const jwt = require('jsonwebtoken')

const secretKey = process.env["SECRET_KEY"];
console.log(secretKey)

app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.get('/SignIn', (req, res) => {
    const { email, password } = req.query;
    const user = (agentes.results).find((u) => u.email == email && u.password == password);

    if (user) {
        const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + 120, data: user, },
            secretKey
        );

        res.send(`<a href="/RutaRestringida?token=${token}"> <p> Ir a la RutaRestringida </p> </a>
    Bienvenido, ${email}.
    <script>
    localStorage.setItem('token', JSON.stringify("${token}"))
    </script>
    `);
    } else {
        res.send("Usuario o contraseña incorrecta");
    }
});

const Verificar = (req, res, next) => {
    let { token } = req.query;
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            res.status(401).send({
                error: "401 No Autorizado",
                message: err.message,
            })
        } else {
            req.user = decoded;
            next();
        };


    })
};


app.get("/RutaRestringida", Verificar, (req, res) => {
    res.send(` Bienvenido a la Zona X ${req.user.data.email}`);
});



app.listen(3000, () => console.log('Sevidor ON en puerto 3000'))

