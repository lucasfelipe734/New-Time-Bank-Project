const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

const db = require('./models/database'); // Importe o módulo da conexão com o banco de dados

app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


//BackEnd - Chamada ao banco tela de login

app.post("/dado", async (req, res) => {
    console.log("minha requisicao");
    console.log(req.body);

    const cpf = req.body.cpf;
    const senha = req.body.senha;

    const query = "SELECT nome, saldo FROM cliente WHERE cpf=? AND senha=?";

    try {
        const [rows, fields] = await db.query(query, [cpf, senha]);

        if (rows.length !== 0) {
            const cliente = rows[0];
            res.json({
                nome: cliente.nome,
                saldo: cliente.saldo
            });
        } else {
            res.send('Cliente não encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor');
    }
});



//BackEnd - Chamada ao banco PIX
app.post('/transferencia-pix', async (req, res) => {
    const {
        chavePixRemetente,
        chavePixDestinatario,
        valor
    } = req.body;

    const connection = await db.getConnection(); // Use a conexão do módulo de banco de dados

    try {
        await connection.beginTransaction();

        const [remetente] = await connection.execute('SELECT * FROM cliente WHERE chave_pix = ?', [chavePixRemetente]);
        const [destinatario] = await connection.execute('SELECT * FROM cliente WHERE chave_pix = ?', [chavePixDestinatario]);

        if (remetente.length === 0 || destinatario.length === 0) {
            throw new Error('Conta remetente ou destinatário não encontrada.');
        }

        if (remetente[0].saldo < valor) {
            throw new Error('Saldo insuficiente para realizar a transferência.');
        }

        await connection.execute('UPDATE cliente SET saldo = saldo - ? WHERE chave_pix = ?', [valor, chavePixRemetente]);
        await connection.execute('UPDATE cliente SET saldo = saldo + ? WHERE chave_pix = ?', [valor, chavePixDestinatario]);
        await connection.commit();

        res.json({
            success: true
        });
    } catch (error) {
        await connection.rollback();
        res.json({
            success: false,
            error: error.message
        });
    } finally {
        connection.release();
    }
});



app.post('/transferencia', async (req, res) => {
    const { numeroContaRemetente,numeroContaDestinatario, valor } = req.body;

    const connection = await db.getConnection(); // Use a conexão do módulo de banco de dados

    try {
        await connection.beginTransaction();

        const [remetente] = await connection.execute('SELECT * FROM cliente WHERE conta = ?', [numeroContaRemetente]);
        const [destinatario] = await connection.execute('SELECT * FROM cliente WHERE conta = ?', [numeroContaDestinatario]);

        if (remetente.length === 0 || destinatario.length === 0) {
            throw new Error('Conta remetente ou destinatário não encontrada.');
        }

        if (remetente[0].saldo < valor) {
            throw new Error('Saldo insuficiente para realizar a transferência.');
        }

        await connection.execute('UPDATE cliente SET saldo = saldo - ? WHERE conta = ?', [valor, numeroContaRemetente]);
        await connection.execute('UPDATE cliente SET saldo = saldo + ? WHERE conta = ?', [valor, numeroContaDestinatario]);

        await connection.commit();

        res.json({ success: true });
    } catch (error) {
        await connection.rollback();
        res.json({ success: false, error: error.message });
    } finally {
        connection.release();
    }
});

app.get('/informacoes-boleto/:codigoBarras', async (req, res) => {
    const codigoBarras = req.params.codigoBarras; // Captura o número do código de barras a partir dos parâmetros da URL

    const connection = await db.getConnection(); // Use a conexão do módulo de banco de dados

    try {
        // Consulta a tabela "boleto" com base no número do código de barras fornecido
        const [boletoInfo] = await connection.execute('SELECT cnpj, razaoSocial, valorBoleto, bancoBoleto FROM boleto WHERE codigoBarras = ?', [codigoBarras]);

        if (boletoInfo.length === 0) {
            throw new Error('Informações de boleto não encontradas para o código de barras fornecido.');
        }

        // Retorna as informações do boleto em formato JSON
        res.json({
            success: true,
            cnpj: boletoInfo[0].cnpj,
            razaoSocial: boletoInfo[0].razaoSocial,
            valorBoleto: boletoInfo[0].valorBoleto,
            bancoBoleto: boletoInfo[0].bancoBoleto
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message
        });
    } finally {
        connection.release();
    }
});


app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});