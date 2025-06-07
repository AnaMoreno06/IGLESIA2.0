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
let idEventoAEliminar = null;



// Mostrar panel si es administrador
function mostrarPanelAdmin() {
  const seccionEventos = document.querySelector(".container") || document.querySelector(".eventos") || document.body;

  if (document.querySelector(".admin-panel")) return;

  const panelAdmin = document.createElement("div");
  panelAdmin.className = "admin-panel";
  panelAdmin.innerHTML = `
    <div class="admin-panel-inner">
      <h3>👨‍💼 Panel de Administración</h3>
      <div class="botones-admin">
      
        <button onclick="agregarEventoRapido()">➕ Agregar Evento</button>
        <button onclick="cerrarSesionAdmin()" class="btn-cerrar">🚪 Cerrar Sesión</button>
      </div>
    </div>
  `;

  // Agrega estilos modernos
 const estilo = document.createElement("style");
estilo.textContent = ` ... `;
document.head.appendChild(estilo);

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
  <div class="evento-card">
    <div class="evento-header">
      <h3>${evento.titulo || 'Sin título'}</h3>
      <span class="evento-fecha">${fecha.toLocaleDateString('es-ES', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      })}</span>
      <span class="evento-hora">${fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} hs</span>
    </div>
    <p class="evento-descripcion">${evento.descripcion || 'Sin descripción'}</p>
    ${esAdmin ? `
      <div class="evento-controles">
        <button onclick="editarEvento('${doc.id}')">✏️ Editar</button>
        <button onclick="eliminarEvento('${doc.id}')" class="btn-eliminar">🗑️ Eliminar</button>
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

    document.getElementById("editar-id").value = id;
    document.getElementById("editar-titulo").value = data.titulo;
    document.getElementById("editar-descripcion").value = data.descripcion;

    document.getElementById("modal-editar-evento").style.display = "flex";
  });
}


function eliminarEvento(id) {
  idEventoAEliminar = id;
  document.getElementById("modal-confirmar-eliminar").style.display = "flex";
}
async function confirmarEliminar() {
  if (!idEventoAEliminar) return;

  try {
    await db.collection("eventos").doc(idEventoAEliminar).delete();
    alert("✅ Evento eliminado");
    cerrarModalEliminar();
    cargarEventosFirebase();
  } catch (e) {
    console.error("❌ Error al eliminar:", e);
    alert("❌ No se pudo eliminar el evento");
  }

  idEventoAEliminar = null; // Limpiar
}
function cerrarModalEliminar() {
  document.getElementById("modal-confirmar-eliminar").style.display = "none";
  idEventoAEliminar = null;
}


document.getElementById("form-editar-evento").addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = document.getElementById("editar-id").value;
  const nuevoTitulo = document.getElementById("editar-titulo").value.trim();
  const nuevaDescripcion = document.getElementById("editar-descripcion").value.trim();

  if (!nuevoTitulo || !nuevaDescripcion) {
    alert("Todos los campos son obligatorios");
    return;
  }

  try {
    await db.collection("eventos").doc(id).update({
      titulo: nuevoTitulo,
      descripcion: nuevaDescripcion
    });
    alert("✅ Evento actualizado");
    cerrarModalEditar();
    cargarEventosFirebase();
  } catch (e) {
    alert("❌ Error al actualizar: " + e.message);
  }
});


function cerrarModalEditar() {
  document.getElementById("modal-editar-evento").style.display = "none";
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
