//container para ficar travado igual a foto
document.addEventListener('pagar-container', function (e) {
    e.preventDefault();
  });
  
  
  document.getElementById('btnpagar').addEventListener('click', function (e) {
    validaBoleto();
  });
  
  
  const codigos = ["5687515687546", "5478121859687", "8743684321879", "8654213548351", "3899565487653"]; 
  var saldo = 1200;
  var valor = 50;
  async function validaBoleto(){
        var codigoBarras = document.getElementById("boleto").value;
  

        //tranferir foto por case nao funcionando
        switch (codigoBarras) {
          case '5687515687546':
            valor = 100;
            pagando();
            const foto1 = await fetch("img/14.png");
          // Define o inner HTML do elemento de imagem
          document.querySelector("#fotoPagando").innerHTML = `<img src="${foto1.url}" alt="">`;
            break;
  
          case '5478121859687':
          valor = 200;  
          pagando();
          break;
  
          case '8743684321879':
            valor = 150;
            pagando();
            break;
          
          case '8654213548351':
          valor = 130
          pagando();
          break;
          
          case '3899565487653':
          valor = 230;
          pagando();
          break;
          
          default:
            //continua tranferindo porque o form actio no pagar obriga a pagina a tranferir
            alert("Código de barras inexistente!");
            return false;
        }
  }
        function pagando(){
          if(saldo > valor){
            window.location.href = "confirmacaoPagamento.html";
          } else{
            alert("Saldo Insuficiente!");
          }
        }
  