// function enviarDados() {
//     const formData = new FormData(document.getElementById("meuForm"));
//     const data = {
//         cpf: formData.get("cpf"),
//         senha: formData.get("senha")
//     };

//     fetch('/dado', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//     .then(response => response.text())
//     .then(data => {
//         if(data == 'true'){
//             window.location.href = "/telaBoasVindas.html";
//         }else{
//             alert("Usuário Invalido")
//         }
//     })
    
// }


// function enviarDados() {
//     const formData = new FormData(document.getElementById("meuForm"));
//     const data = {
//         cpf: formData.get("cpf"),
//         senha: formData.get("senha")
//     };

//     fetch('/dado', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//     .then(response => response.json())
//     .then(data => {
//         if(data.nome) {
//             // O nome foi encontrado, você pode usá-lo como quiser no seu front-end
//             const nomeDoCliente = data.nome;
//             alert("Bem-vindo, " + nomeDoCliente);
//             global.nomeDoCliente = nomeDoCliente; 
//             // Você também pode redirecionar ou fazer outras ações aqui
//         } else {
//             alert("Usuário Inválido");
//         }
//     });
// }


                //Ultimo FUNCIONANDO 

// function enviarDados() {
//     const formData = new FormData(document.getElementById("meuForm"));
//     const data = {
//         cpf: formData.get("cpf"),
//         senha: formData.get("senha")
//     };

//     fetch('/dado', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//     .then(response => response.json())
//     .then(data => {
//         if(data.nome) {
//             // O nome foi encontrado, você pode usá-lo como quiser no seu front-end
//             const nomeDoCliente = data.nome;
//             alert("Bem-vindo, " + nomeDoCliente);
//             window.location.href = "/menu.html";

//             // Armazene o nomeDoCliente no localStorage
//             localStorage.setItem('nomeDoCliente', nomeDoCliente);

//             // Você também pode redirecionar ou fazer outras ações aqui
//         } else {
//             alert("Usuário Inválido");
//         }
//     });
// }

function enviarDados() {
    const formData = new FormData(document.getElementById("meuForm"));
    const data = {
        cpf: formData.get("cpf"),
        senha: formData.get("senha")
    };

    fetch('/dado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.nome) {
            // O nome foi encontrado, você pode usá-lo como quiser no seu front-end
            const nomeDoCliente = data.nome;
            const saldoDoCliente = data.saldo; // Adicione esta linha para obter o saldo

            alert("Bem-vindo, " + nomeDoCliente);
            alert("Saldo: " + saldoDoCliente); // Exibir o saldo

            window.location.href = "/telaBoasVindas.html";

            // Armazene o nomeDoCliente e saldoDoCliente no localStorage
            localStorage.setItem('nomeDoCliente', nomeDoCliente);
            localStorage.setItem('saldoDoCliente', saldoDoCliente);

            // Você também pode redirecionar ou fazer outras ações aqui
        } else {
            alert("Usuário Inválido");
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
    
}
