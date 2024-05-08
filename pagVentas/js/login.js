import { ManageAccount } from './firebaseAuth.js';

//RECOGE EL FORMULARIO QUE ESTA EN LA PAGINA LOGIN

$("#formulario-sesion").on("submit", function(event) {
  event.preventDefault();

  const email = $("#login-user").val();
  const password = $("#login-password").val();

  const account = new ManageAccount();
  account.authenticate(email, password);

});


  

