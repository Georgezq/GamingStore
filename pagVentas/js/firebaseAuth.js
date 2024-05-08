//CONFIGURACION DEL FIREBASE PARA EL AUTH

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

//LLAVES 

const firebaseConfig = {
    apiKey: "AIzaSyDtPJTM1xjYTZS4xvHe1r1yBrO5-uX_8z8",
    authDomain: "venta-pag.firebaseapp.com",
    projectId: "venta-pag",
    storageBucket: "venta-pag.appspot.com",
    messagingSenderId: "968148514687",
    appId: "1:968148514687:web:fea96a4ce164b775bc4c4a"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const user = auth.currentUser;

//AQUI ESTÁN TODAS LAS CLASES NECESARIAS REGISTRO - AUTENTICACION - CIERRE DE SESIÓN (IMPORTANTES

export class ManageAccount {
  register(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
    .then((_) => {
      MJSSIGNUPOK();
      setTimeout(() => {
          window.location.href = "index.html";
      }, 2000); 
    })
    .catch((error) => {
      MJSSIGNUPFAIL();
    });
  }

  authenticate(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((_) => {
        MJSAUTHOK();
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000); 
      })
      .catch((error) => {
        MJSAUTHFAIL();
      });
}

  signOut() {
    signOut(auth)
    .then((_) => {
          window.location.href = "index.html";
    })
    .catch((error) => {
      
    });
  }
}

//Cierre de la sesión asignado a un boton con ese ID

$("#signOutBtn").on("click", function() {
  const account = new ManageAccount();
  account.signOut();
});

//Estado de la sesión y perfil de usuario

//AQUI LO QUE HAGO ES TOMAR EL ESTADO DE LA SESION PARA MOSTRAR LOS ICONOS
//Y TAMBIEN DIRECTAMENTE PONGO EL CORREO QUE TENDRÁ PERMITIDO VER LA OPCION DE AGREGAR JUEGOS
auth.onAuthStateChanged((user) => {
  if (user) {
    $("#userIconContainer").css("display", "none");
    $("#signOutButton").css("display", "block");

    const email = user.email;

    const adminEmail = "yosho2mendoza@gmail.com";

    if (email === adminEmail) {
      $("#adminSection").css("display", "block");
    }

} else {
    $("#userIconContainer").css("display", "block");
    $("#signOutButton").css("display", "none");
  }
});


//Mensajes de Alerta

//Registro
const MJSSIGNUPOK = () => {
  Swal.fire({
      title: "Registro exitoso!",
      text: "Serás redirigido a la página principa!",
      icon: "success"
    });
}

const MJSSIGNUPFAIL = () => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Pruebe a poner correctamente los campos!",
  });
}


//Inicio de sesion
const MJSAUTHOK = () => {
    Swal.fire({
        title: "Inicio de sesión exitoso!",
        text: "Serás redirigido a la página principa!",
        icon: "success"
      });
}

const MJSAUTHFAIL = () => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Credenciales incorrectas!",
  });
}

