//CONFIGURACION BASE DE FIREBASE

const firebaseConfig = {
    apiKey: "AIzaSyDtPJTM1xjYTZS4xvHe1r1yBrO5-uX_8z8",
    authDomain: "venta-pag.firebaseapp.com",
    projectId: "venta-pag",
    storageBucket: "venta-pag.appspot.com",
    messagingSenderId: "968148514687",
    appId: "1:968148514687:web:fea96a4ce164b775bc4c4a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

//ERROR POR FALTA DE LOS DOS DATOS

const SaveGames = (games) => {
  if (!games.nombre || !games.precio) {
      MJSFAIL();
      return; 
  }

  //MANDAR DATOS PREDETERMINADOS

  games.imagen = games.imagen || "https://www.adrenaline.com.br/wp-content/uploads/2023/11/League-of-Legends-vai-mudar-seu-mapa-central-na-proxima-temporada-912x569.jpg";
  games.video = games.video || "https://gaming-cdn.com/videos/products/2075/800x450/ready-or-not-pc-juego-steam-preview.webm?v=1657027479";

 
  // Guardar el juego en la base de datos
  db.collection("juegos").add({
      games
  })
  .then((docRef) => {
      MJSOK();
      $("#nombre").val("");
      $("#precio").val("");
      $("#imagen").val("");
      $("#video").val("");
  })
  .catch((error) => {
      MJSFAIL();
  });
}

//Accion del boton con su ID para agregar

$("#AddBtn").on('click', () => {
  let nombre = $("#nombre").val();
  let precio = $("#precio").val();
  let imagen = $("#imagen").val();
  let video = $("#video").val();

  const games = {
      nombre,
      precio,
      imagen,
      video
  }

  SaveGames(games);
});

//Cargar los juegos en la pantalla de "Tendencias"

db.collection("juegos").get().then((querySnapshot) => {
  
    querySnapshot.forEach((doc) => {
        const juego = doc.data().games;

        //CODIGO HTML QUE SERA COLOCADO POR CADA ITEM EN LA BD
        
        const gameElement = `
            <div class="item">
              <a href="" class="cover position-relative d-inline-block overflow-hidden object-fit-cover" onmouseover="playVideo(this)" onmouseout="pauseVideo(this)">
                <picture>
                  <img style="width: 350px; height: 200px; border-radius: 12px" src="${juego.imagen}" loading="lazy" alt="" />
                </picture>
                <video preload="none" loop muted playsinline style="max-width: 350px; max-height: 200px; object-fit: cover">
                  <source src="${juego.video}" type="video/webm" />
                </video>
              </a>
              <div class="information text-white d-flex overflow-hidden">
                <div class="text-game">${juego.nombre}</div>
                <div class="price ms-auto">${juego.precio}$</div>
              </div>
            </div>
        `;
        
        $("#gamescontent").append(gameElement);
    });
});

//Obtener datos para la edición


const juegosRef = db.collection("juegos");

//Actualizacion de la tabla

juegosRef.onSnapshot((snapshot) => {
    $("#gamesTable tbody").empty();
    
    snapshot.forEach((doc) => {
        const juego = doc.data().games;
        
        const gameElement = `
            <tr>
                <td>${juego.nombre}</td>
                <td>${juego.precio}$</td>
                <td><button class="btnVerDetalles btn" data-id="${doc.id}" style="text-decoration: underline;">Ver Detalles</button></td>
            </tr>
        `;
        
        // Agregar el elemento de juego al cuerpo de la tabla
        $("#gamesTable tbody").append(gameElement);
    });
});


//Cargar los datos al formulario

$(document).on("click", ".btnVerDetalles", function() {
  const juegoId = $(this).data("id");

  //Guarda el ID para la actualizacion

  $("#idJuego").val(juegoId);
  
  db.collection("juegos").doc(juegoId).get()
      .then((doc) => {
          if (doc.exists) {
              const juegoData = doc.data().games;
              $("#nombre-edit").val(juegoData.nombre);
              $("#precio-edit").val(juegoData.precio);
              $("#imagen-edit").val(juegoData.imagen || ""); 
              $("#video-edit").val(juegoData.video || ""); 
          } else {
              
          }
      })
      .catch((error) => {
          console.log("Error obteniendo el juego:", error);
      });
});

//Boton para la edición

$("#EditBtn").on("click", function() {
  //Obtener los valores de los ID del HTML
  const juegoId = $("#idJuego").val(); 
  
  const nombre = $("#nombre-edit").val();
  const precio = $("#precio-edit").val();
  const imagen = $("#imagen-edit").val();
  const video = $("#video-edit").val();

  if (!juegoId || !nombre || !precio) {
      MJSFAILEDIT();
      return;
  }

  // Realizar la actualización del juego en Firestore y enviar el valor predeterminado
  db.collection("juegos").doc(juegoId).update({
      "games.nombre": nombre,
      "games.precio": precio,
      "games.imagen": imagen || "https://www.adrenaline.com.br/wp-content/uploads/2023/11/League-of-Legends-vai-mudar-seu-mapa-central-na-proxima-temporada-912x569.jpg",
      "games.video": video || "https://gaming-cdn.com/videos/products/2075/800x450/ready-or-not-pc-juego-steam-preview.webm?v=1657027479",
  })
  .then(() => {
      MJSOKEDIT();
      //Limpiar
      $("#nombre-edit").val("");
      $("#precio-edit").val("");
      $("#imagen-edit").val("");
      $("#video-edit").val("");
  })
  .catch((error) => {
      console.error("Error al actualizar el juego:", error);
  });
});


//Eliminación del juego
const juegosRefD = db.collection("juegos");

//Actualización a tiempo real de los datos al eliminar 
juegosRefD.onSnapshot((snapshot) => {
    $("#gamesTableDelete tbody").empty();
    
    snapshot.forEach((doc) => {
        const juego = doc.data().games;
        //Poner los datos en la tabla
        const gameElement = `
            <tr>
                <td>${juego.nombre}</td>
                <td>${juego.precio}$</td>
                <td><button class="btnEliminar btn" data-id="${doc.id}" style="text-decoration: underline;"><i class="bi bi-trash fs-5"></i>
                </button></td>            </tr>
        `;
        
        // Agregar el elemento de juego al cuerpo de la tabla
        $("#gamesTableDelete tbody").append(gameElement);
    });
});

// Acción para eliminar
$(document).on("click", ".btnEliminar", function() {
  const gameId = $(this).data("id");

  Swal.fire({
    title: "Seguro que quieres eliminar este dato?",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    denyButtonText: `Don't save`
    //Si acepta se elimina
  }).then((result) => {
    if (result.isConfirmed) {
      db.collection("juegos").doc(gameId).delete()
    } 
  });
  
});

//ALERTAS

const MJSOK = () => {
  Swal.fire({
      title: "Registro exitoso!",
      text: "Juego añadido correctamente!",
      icon: "success"
    });
}

const MJSFAIL = () => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Complete correctamente los campos!",
  });
}

const MJSOKEDIT = () => {
  Swal.fire({
      title: "Registro exitoso!",
      text: "Juego actualizado correctamente!",
      icon: "success"
    });
}

const MJSFAILEDIT = () => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Algo ha ocurrido!",
  });
}
