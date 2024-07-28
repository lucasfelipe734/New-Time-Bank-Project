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
    .then(response => response.text())
    .then(data => {
        if(data == 'true'){
            window.location.href = "/index2.html";
        }else{
            alert("Usuário Invalido")
        }
    })
    
}