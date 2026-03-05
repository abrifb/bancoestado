const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const filePath = path.join(__dirname, 'data', 'clientes.json');

// ===============================
// FUNCIONES ARCHIVO JSON
// ===============================

function leerDatos() {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({ clientes: [] }, null, 2));
    }
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

function guardarDatos(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ===============================
// LISTADOS
// ===============================

// 1️⃣ Listar todos
app.get('/clientes', (req, res) => {
    const data = leerDatos();
    res.json(data.clientes);
});

// 2️⃣ Listar clientes con Cuenta RUT
app.get('/clientes/rut', (req, res) => {
    const data = leerDatos();
    const clientesRut = data.clientes.filter(c => c.cuentaRut !== null);
    res.json(clientesRut);
});

// ===============================
// CREAR CLIENTES
// ===============================

// 3️⃣ Cliente + Cuenta RUT
app.post('/clientes/rut', (req, res) => {
    const data = leerDatos();
    const { nombre, rut, saldo } = req.body;

    if (!nombre || !rut) {
        return res.status(400).json({ error: "Nombre y RUT son obligatorios" });
    }

    const existe = data.clientes.find(c => c.rut === rut);
    if (existe) {
        return res.status(400).json({ error: "Ya existe un cliente con ese RUT" });
    }

    const nuevoCliente = {
        id: Date.now(),
        nombre,
        rut,
        cuentaRut: {
            numero: Date.now(),
            saldo: Number(saldo)
        },
        cuentasAhorro: []
    };

    data.clientes.push(nuevoCliente);
    guardarDatos(data);

    res.json({ mensaje: "Cliente con Cuenta RUT agregado correctamente" });
});

// 4️⃣ Cliente + Cuenta AHORRO
app.post('/clientes/ahorro', (req, res) => {
    const data = leerDatos();
    const { nombre, rut, saldo } = req.body;

    if (!nombre || !rut) {
        return res.status(400).json({ error: "Nombre y RUT son obligatorios" });
    }

    const existe = data.clientes.find(c => c.rut === rut);
    if (existe) {
        return res.status(400).json({ error: "Ya existe un cliente con ese RUT" });
    }

    const nuevoCliente = {
        id: Date.now(),
        nombre,
        rut,
        cuentaRut: null,
        cuentasAhorro: [
            {
                numero: Date.now(),
                saldo: Number(saldo)
            }
        ]
    };

    data.clientes.push(nuevoCliente);
    guardarDatos(data);

    res.json({ mensaje: "Cliente con Cuenta Ahorro agregado correctamente" });
});

// ===============================
// AGREGAR CUENTAS
// ===============================

// 5️⃣ Agregar Cuenta RUT a cliente existente
app.post('/clientes/:id/agregar-rut', (req, res) => {
    const data = leerDatos();
    const cliente = data.clientes.find(c => c.id == req.params.id);

    if (!cliente) {
        return res.status(404).json({ error: "Cliente no existe" });
    }

    // 🔴 Validación clave: SOLO UNA Cuenta RUT
    if (cliente.cuentaRut !== null) {
        return res.status(400).json({
            error: "El cliente ya tiene una Cuenta RUT"
        });
    }

    cliente.cuentaRut = {
        numero: Date.now(),
        saldo: Number(req.body.saldo)
    };

    guardarDatos(data);

    res.json({ mensaje: "Cuenta RUT agregada correctamente" });
});

// 6️⃣ Agregar Cuenta AHORRO
app.post('/clientes/:id/agregar-ahorro', (req, res) => {
    const data = leerDatos();
    const cliente = data.clientes.find(c => c.id == req.params.id);

    if (!cliente) {
        return res.status(404).json({ error: "Cliente no existe" });
    }

    cliente.cuentasAhorro.push({
        numero: Date.now(),
        saldo: Number(req.body.saldo)
    });

    guardarDatos(data);

    res.json({ mensaje: "Cuenta Ahorro agregada correctamente" });
});

// ===============================
// ELIMINACIONES
// ===============================

// 7️⃣ Eliminar Cliente completo
app.delete('/clientes/:id', (req, res) => {
    const data = leerDatos();
    const cliente = data.clientes.find(c => c.id == req.params.id);

    if (!cliente) {
        return res.status(404).json({ error: "Cliente no existe" });
    }

    data.clientes = data.clientes.filter(c => c.id != req.params.id);

    guardarDatos(data);
    res.json({ mensaje: "Cliente eliminado correctamente" });
});

// 8️⃣ Eliminar Cuenta RUT
app.delete('/clientes/:id/rut', (req, res) => {
    const data = leerDatos();
    const cliente = data.clientes.find(c => c.id == req.params.id);

    if (!cliente) {
        return res.status(404).json({ error: "Cliente no existe" });
    }

    if (cliente.cuentaRut === null) {
        return res.status(400).json({ error: "El cliente no tiene Cuenta RUT" });
    }

    if (cliente.cuentasAhorro.length === 0) {
        return res.status(400).json({
            error: "No puede quedar sin ninguna cuenta"
        });
    }

    cliente.cuentaRut = null;

    guardarDatos(data);
    res.json({ mensaje: "Cuenta RUT eliminada correctamente" });
});

// 9️⃣ Eliminar Cuenta AHORRO
app.delete('/clientes/:id/ahorro/:numero', (req, res) => {
    const data = leerDatos();
    const cliente = data.clientes.find(c => c.id == req.params.id);

    if (!cliente) {
        return res.status(404).json({ error: "Cliente no existe" });
    }

    cliente.cuentasAhorro = cliente.cuentasAhorro.filter(
        a => a.numero != req.params.numero
    );

    if (cliente.cuentaRut === null && cliente.cuentasAhorro.length === 0) {
        return res.status(400).json({
            error: "Debe tener al menos una cuenta"
        });
    }

    guardarDatos(data);
    res.json({ mensaje: "Cuenta Ahorro eliminada correctamente" });
});

// ===============================
// SERVIDOR
// ===============================

app.listen(3000, () => {
    console.log("Servidor BancoEstado en puerto 3000");
});