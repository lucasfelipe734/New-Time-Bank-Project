const express = require('express');
const path = require('path'); //lendo arquivos do diretorio
const app = express(); //gerencia rotas requisições e executar projeto

const db = require('./models/db');

//app.get("/", async (req, res) => { res.sendFile(__dirname + "/Index.html") });

app.use(express.static(path.join(__dirname)));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post("/dado", async (req, res) => {

    console.log("minha requisicao")
    console.log(req.body)


    const query = "SELECT * FROM cliente WHERE cpf=\'" + req.body.cpf + "\'" + " AND " + "senha=\'" + req.body.senha + "\'" 

    db.query(query, (err, data) => {
        console.log(data)
        if (data.length != 0) {
            res.send('true')
        } else {
            res.send('false')
        }

    });

}); //Post não da para acesstar através do navegador


app.listen(8000, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:8000");
})