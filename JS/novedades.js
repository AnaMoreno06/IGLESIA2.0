// novedades.js

// Inicializar Firebase si no se ha hecho ya
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyDsLOgpAcsANPHwiJ6IJwGy528eZMAQNPA",
    authDomain: "iglesia-52bb6.firebaseapp.com",
    projectId: "iglesia-52bb6",
    storageBucket: "iglesia-52bb6.appspot.com",
    messagingSenderId: "436887569868",
    appId: "1:436887569868:web:3232cf05d9c117763fc969",
    measurementId: "G-CJPJZ1TP4T"
  });
}
let esAdmin = false;


const auth = firebase.auth();
const db = firebase.firestore();

// Mostrar panel si es administrador
function mostrarPanelAdmin() {
  const seccionEventos = document.querySelector(".container") || document.querySelector(".eventos") || document.body;

  if (document.querySelector(".admin-panel")) return;

  const panelAdmin = document.createElement("div");
  panelAdmin.className = "admin-panel";
  panelAdmin.innerHTML = `
    <h3>👨‍💼 Panel de Administración</h3>
    <button onclick="abrirEditorEventos()">✏️ Editar Eventos</button>
    <button onclick="agregarEventoRapido()" style="margin-left:10px;">➕ Agregar Evento</button>
    <button onclick="cerrarSesionAdmin()" style="margin-left:10px;background:red;color:white;">🚪 Cerrar Sesión</button>
  `;
  seccionEventos.insertBefore(panelAdmin, seccionEventos.firstChild);
}

// Cargar eventos desde Firebase
async function cargarEventosFirebase() {
  const contenedor = document.getElementById('eventos-firebase');
  const loading = document.getElementById('firebase-loading');

  try {
    const snapshot = await db.collection('eventos').orderBy('fecha', 'asc').limit(20).get();
    if (snapshot.empty) {
      loading.innerHTML = '<p style="text-align:center;">📭 No hay eventos</p>';
      return;
    }

    let html = '';
    snapshot.forEach(doc => {
      const evento = doc.data();
      const fecha = evento.fecha ? evento.fecha.toDate() : new Date();
      const fechaTexto = fecha.toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric'
      });

      html += `
        <div class="evento-item" style="border:1px solid #ccc;padding:15px;margin:10px 0;border-radius:10px;">
          <h3>${evento.titulo || 'Sin título'}</h3>
          <p class="fecha">${fechaTexto}</p>
          <p>${evento.descripcion || 'Sin descripción'}</p>
          ${esAdmin ? `
  <div style="margin-top:10px;">
    <button onclick="editarEvento('${doc.id}')">✏️ Editar</button>
    <button onclick="eliminarEvento('${doc.id}')" style="background:red;color:white;">🗑️ Eliminar</button>
  </div>
` : ''}


        </div>
      `;
    });

    loading.style.display = 'none';
    contenedor.innerHTML = html;

  } catch (e) {
    console.error("❌ Error cargando eventos:", e);
    loading.innerHTML = `<p style="color:red;text-align:center;">❌ ${e.message}</p>`;
  }
}

function editarEvento(id) {
  db.collection('eventos').doc(id).get().then(doc => {
    if (!doc.exists) return alert("Evento no encontrado");
    const data = doc.data();
    const nuevoTitulo = prompt("✏️ Nuevo título:", data.titulo);
    if (nuevoTitulo === null) return;
    const nuevaDescripcion = prompt("📝 Nueva descripción:", data.descripcion);
    if (nuevaDescripcion === null) return;

    db.collection('eventos').doc(id).update({
      titulo: nuevoTitulo,
      descripcion: nuevaDescripcion
    }).then(() => {
      alert("✅ Evento actualizado");
      cargarEventosFirebase();
    });
  });
}

function eliminarEvento(id) {
  if (confirm("¿Eliminar este evento?")) {
    db.collection('eventos').doc(id).delete().then(() => {
      alert("✅ Evento eliminado");
      cargarEventosFirebase();
    });
  }
}

function agregarEventoRapido() {
  document.getElementById("modal-agregar-evento").style.display = "flex";
}
document.getElementById("form-agregar-evento").addEventListener("submit", async function (e) {
  e.preventDefault();

  const titulo = document.getElementById("nuevo-titulo").value;
  const descripcion = document.getElementById("nueva-descripcion").value;
  const fecha = document.getElementById("nueva-fecha").value;
  const hora = document.getElementById("nueva-hora").value;

  try {
    await db.collection("eventos").add({
      titulo,
      descripcion,
      fecha: new Date(`${fecha}T${hora}`)
    });
    alert("✅ Evento agregado con éxito");
    cerrarModalAgregar();
    cargarEventosFirebase();
  } catch (e) {
    alert("❌ Error al agregar el evento: " + e.message);
  }
});

function cerrarModalAgregar() {
  document.getElementById("modal-agregar-evento").style.display = "none";
}

function cerrarSesionAdmin() {
  auth.signOut().then(() => {
    alert("Sesión cerrada");
    location.reload();
  });
}

function abrirEditorEventos() {
  window.location.href = "editar-eventos.html";
}

// Verifica el usuario actual
document.addEventListener("DOMContentLoaded", () => {
  console.log("⏳ Verificando sesión...");
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log("✅ Usuario autenticado:", user.email);
      if (user.email === "keylyovadi@gmail.com") {
        mostrarPanelAdmin();
      }
    } else {
      console.log("❌ No autenticado");
    }
    cargarEventosFirebase();
  });

  auth.onAuthStateChanged(user => {
  if (user && user.email === "keylyovadi@gmail.com") {
    console.log("✅ Usuario administrador:", user.email);
    esAdmin = true;
    mostrarPanelAdmin();
  } else {
    console.log("❌ No autenticado o no es admin");
    esAdmin = false;
  }
  cargarEventosFirebase();
});

});
