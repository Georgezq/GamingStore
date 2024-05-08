import { ManageAccount } from './firebaseAuth.js';

//RECOGE EL FORMULARIO QUE ESTA EN LA PAGINA LOGIN

$("#formulario-crear").on("submit", function(event) {
    event.preventDefault();
  
    const email = $("#signup-user").val();
    const password = $("#signup-password").val();
  
    const account = new ManageAccount();
    account.register(email, password);
  });

