const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const filePath = path.join(__dirname, 'data', 'clientes.json');

// Funciones para leer y guardar
function leerDatos() {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

function guardarDatos(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

app.get('/clientes', (req, res) => {
    const data = leerDatos();
    res.json(data.clientes);
});

app.get('/clientes/rut', (req, res) => {
    const data = leerDatos();
    const clientesRut = data.clientes.filter(c => c.cuentaRut !== null);
    res.json(clientesRut);
});

app.post('/clientes/rut', (req, res) => {
    const data = leerDatos();
    const { nombre, rut, saldo } = req.body;

    const nuevoCliente = {
        id: Date.now(),
        nombre,
        rut,
        cuentaRut: {
            numero: Date.now(),
            saldo
        },
        cuentasAhorro: []
    };

    data.clientes.push(nuevoCliente);
    guardarDatos(data);

    res.json({ mensaje: "Cliente con Cuenta RUT agregado" });
});

app.post('/clientes/ahorro', (req, res) => {
    const data = leerDatos();
    const { nombre, rut, saldo } = req.body;

    const nuevoCliente = {
        id: Date.now(),
        nombre,
        rut,
        cuentaRut: null,
        cuentasAhorro: [
            {
                numero: Date.now(),
                saldo
            }
        ]
    };

    data.clientes.push(nuevoCliente);
    guardarDatos(data);

    res.json({ mensaje: "Cliente con Cuenta Ahorro agregado" });
});

app.post('/clientes/:id/agregar-rut', (req, res) => {
    const data = leerDatos();
    const cliente = data.clientes.find(c => c.id == req.params.id);

    if (!cliente) return res.status(404).json({ error: "Cliente no existe" });

    if (cliente.cuentaRut)
        return res.status(400).json({ error: "Ya tiene Cuenta RUT" });

    cliente.cuentaRut = {
        numero: Date.now(),
        saldo: req.body.saldo
    };

    guardarDatos(data);
    res.json({ mensaje: "Cuenta RUT agregada" });
});

app.post('/clientes/:id/agregar-ahorro', (req, res) => {
    const data = leerDatos();
    const cliente = data.clientes.find(c => c.id == req.params.id);

    if (!cliente) return res.status(404).json({ error: "Cliente no existe" });

    cliente.cuentasAhorro.push({
        numero: Date.now(),
        saldo: req.body.saldo
    });

    guardarDatos(data);
    res.json({ mensaje: "Cuenta ahorro agregada" });
});

app.delete('/clientes/:id', (req, res) => {
    const data = leerDatos();
    data.clientes = data.clientes.filter(c => c.id != req.params.id);

    guardarDatos(data);
    res.json({ mensaje: "Cliente eliminado" });
});

app.delete('/clientes/:id/rut', (req, res) => {
    const data = leerDatos();
    const cliente = data.clientes.find(c => c.id == req.params.id);

    if (!cliente) return res.status(404).json({ error: "Cliente no existe" });

    if (cliente.cuentasAhorro.length === 0)
        return res.status(400).json({ error: "Debe tener al menos una cuenta" });

    cliente.cuentaRut = null;

    guardarDatos(data);
    res.json({ mensaje: "Cuenta RUT eliminada" });
});

app.delete('/clientes/:id/ahorro/:numero', (req, res) => {
    const data = leerDatos();
    const cliente = data.clientes.find(c => c.id == req.params.id);

    cliente.cuentasAhorro = cliente.cuentasAhorro.filter(
        a => a.numero != req.params.numero
    );

    if (!cliente.cuentaRut && cliente.cuentasAhorro.length === 0)
        return res.status(400).json({ error: "Debe tener al menos una cuenta" });

    guardarDatos(data);
    res.json({ mensaje: "Cuenta ahorro eliminada" });
});

app.listen(3000, () => {
    console.log("Servidor BancoEstado en puerto 3000");
});