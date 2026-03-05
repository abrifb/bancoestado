const API = "http://localhost:3000";

function manejarRespuesta(respuesta) {
    if (respuesta.mensaje) {
        alert(respuesta.mensaje);
    } else if (respuesta.error) {
        alert("❌ Error: " + respuesta.error);
    } else {
        mostrar(respuesta);
    }
}

function mostrar(data) {
    document.getElementById("resultado").textContent =
        JSON.stringify(data, null, 2);
}

// 1
function listarClientes() {
    fetch(`${API}/clientes`)
        .then(res => res.json())
        .then(data => manejarRespuesta(data));
}

// 2
function listarClientesRut() {
    fetch(`${API}/clientes/rut`)
        .then(res => res.json())
        .then(data => manejarRespuesta(data));
}

// 3
function crearClienteRut() {
    fetch(`${API}/clientes/rut`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nombre: nombreRut.value,
            rut: rutRut.value,
            saldo: Number(saldoRut.value)
        })
    })
    .then(res => res.json())
    .then(data => manejarRespuesta(data));
}

// 4
function crearClienteAhorro() {
    fetch(`${API}/clientes/ahorro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nombre: nombreAhorro.value,
            rut: rutAhorro.value,
            saldo: Number(saldoAhorro.value)
        })
    })
    .then(res => res.json())
    .then(data => manejarRespuesta(data));
}

// 5
function agregarRut() {
    fetch(`${API}/clientes/${idRutExistente.value}/agregar-rut`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            saldo: Number(saldoNuevaRut.value)
        })
    })
    .then(res => res.json())
    .then(data => manejarRespuesta(data));
}

// 6
function agregarAhorro() {
    fetch(`${API}/clientes/${idAhorroExistente.value}/agregar-ahorro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            saldo: Number(saldoNuevoAhorro.value)
        })
    })
    .then(res => res.json())
    .then(data => manejarRespuesta(data));
}

// 7
function eliminarCliente() {
    fetch(`${API}/clientes/${idEliminarCliente.value}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => manejarRespuesta(data));
}

// 8
function eliminarRut() {
    fetch(`${API}/clientes/${idEliminarRut.value}/rut`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => manejarRespuesta(data));
}

// 9
function eliminarAhorro() {
    fetch(`${API}/clientes/${idEliminarAhorro.value}/ahorro/${numeroAhorro.value}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => manejarRespuesta(data));
}