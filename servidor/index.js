const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host:"127.0.0.1",
    user: "root",
    password: "asd123",
    database: "ssa2"
});

app.post("/create",(req,res)=>{
    const id_asiento = req.body.id_asiento;
    const fecha = req.body.fecha;
    const descripcion = req.body.descripcion;

    db.query('INSERT INTO asientos(id_asiento,descripcion,fecha) VALUES (?,?,?)',[id_asiento,descripcion,fecha],
    (err,result)=>{
        if (err){
            console.log(err);
        }else{
            res.send("Asiento registrado con exito!");
        }
    }
    );
});
//----------------------------------------------
app.post("/crearCuenta",(req,res)=>{
    const id_cuenta = req.body.id_cuenta
    const nomCuenta = req.body.nomCuenta
    const tipoCuenta = req.body.tipoCuenta
    const admiteSaldo = req.body.admiteSaldo

    db.query('INSERT INTO cuentas_contables(id,cuenta,tipo_cuenta,admite_Saldo) VALUES (?,?,?,?)',[id_cuenta,nomCuenta,tipoCuenta,admiteSaldo],
    (err,result)=>{
        if (err){
            console.log(err);
        }else{
            res.send("Asiento registrado con exito!");
        }
    });
});
//-------------------------------------------------------
app.post("/createAcc",(req,res)=>{
    const cuenta = req.body.cuenta;
    const debe = req.body.debe;
    const haber = req.body.haber;
    const fecha = req.body.fecha;

    db.query('INSERT INTO cuentas(cuenta,debe,haber,fecha) VALUES (?,?,?,?)',[cuenta,debe,haber, fecha],
    (err,result)=>{
        if (err){
            console.log(err);
        }else{
            res.send("Asiento registrado con exito!");
        }
    }
    );
});


app.get("/asientos",(req,res)=>{
    db.query('SELECT * FROM asientos', (err,result)=>{
        if (err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
});

app.get("/numAsiento",(req,res)=>{
    db.query('SELECT id_asiento FROM asientos ORDER BY id_asiento DESC LIMIT 1;',
    (err,result)=>{
        if (err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
});

app.get("/cuentas2",(req,res)=>{
    db.query('SELECT * FROM cuentas',
    (err,result)=>{
        if (err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
});

app.post("/crearCuenta",(req,res)=>{
    const cuenta = req.body.cuenta;
    db.query('INSERT INTO cuentas_contables(cuenta) VALUES (?)',[cuenta],
    (err,result)=>{
        if (err){
            res.status(500).send("Error al insertar la cuenta.");
        }else{
            res.send("Asiento registrado con exito!");
        }
    }
    );
});

app.get("/cuentas",(req,res)=>{
    db.query('SELECT * FROM cuentas_contables WHERE admite_Saldo = 1',
    (err,result)=>{
        if (err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
});

app.put("/actualizar",(req,res)=>{
    const id = req.body.id;
    const asiento = req.body.asiento;
    const fecha = req.body.fecha;
    const descripcion = req.body.descripcion;

    db.query('UPDATE asientos SET asiento=?,descripcion=?,fecha=? WHERE id=?',[asiento,descripcion,fecha,id],
    (err,result)=>{
        if (err){
            console.log(err);
        }else{
            res.send("Asiento actualizado");
        }
    }
    );
});
/*
app.post("/agregarCuentasAsiento", (req, res) => {
    const fecha = req.body.fecha;
    const id_asiento = req.body.id_asiento;
    const setIdAsientoQuery = 'SET @id_asiento = ?';
    const insertCuentasQuery = `
        INSERT INTO cuentas_asientos (id_asiento, cuenta, debe, haber, fecha)
        SELECT @id_asiento, cuenta, debe, haber, fecha
        FROM cuentas;
    `;

    db.query(setIdAsientoQuery, [id_asiento, fecha], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Error al registrar el asiento" });
        } else {
            db.query(insertCuentasQuery, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ error: "Error al registrar el asiento" });
                } else {
                    res.status(200).json({ message: "Asiento registrado con éxito" });
                }
            });
        }
    });
});*/





app.put("/limpiarRegistroCuentas", (req, res) => {
    db.query('DELETE FROM cuentas', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al eliminar registros.");
        } else {
            res.send(result);
        }
    });
});

app.put("/resetearId", (req, res) => {
    db.query('ALTER TABLE cuentas AUTO_INCREMENT = 1', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al restablecer el autoincremento.");
        } else {
            res.send(result);
        }
    });
});


app.get("/datosAsiento",(req,res)=>{
    db.query('SELECT COUNT(*) > 0 AS hayDatos FROM cuentas;',
    (err,result)=>{
        if (err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
});






//---------------------------------------
//con el post mando los datos de usuario y contrasenia para que me devuelva si el usuario es admin o no
app.post("/admin", (req,res) =>{

    const usuario = req.body.usuario;
    const contrasenia = req.body.contrasenia;

    db.query('SELECT admin FROM usuarios WHERE usuario =? AND contrasenia=?',[usuario,contrasenia],
    (err,result)=>{
        if (err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
});





app.get("/planCuentas",(req,res)=>{
    db.query('SELECT * FROM cuentas_contables', (err,result)=>{
        if (err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
});


app.post("/agregarCuentasAsiento", (req, res) => {
    const id_asiento = req.body.id_asiento;
    const fecha = req.body.fecha;
    
    // Primero, establece la variable  @id_asiento
    const setIdAsientoQuery = 'SET @id_asiento = ?';
    db.query(setIdAsientoQuery, [id_asiento], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Error al establecer el ID de asiento" });
        } else {
            // hace la inserción de datos con la fecha que le paso por parametro
            const insertCuentasQuery = `
                INSERT INTO cuentas_asientos (id_asiento, cuenta, debe, haber, fecha)
                SELECT @id_asiento, cuenta, debe, haber, ? FROM cuentas;
            `;
            db.query(insertCuentasQuery, [fecha], (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ error: "Error al registrar el asiento" });
                } else {
                    res.status(200).json({ message: "Asiento registrado con éxito" });
                }
            });
        }
    });
});



app.get("/libroMayor",(req,res)=>{
    const cuenta = req.query.cuenta;
    db.query('SELECT id_asiento, cuenta, debe, haber, fecha FROM cuentas_asientos WHERE cuenta=?',[cuenta],
    (err,result)=>{
        if (err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
});

app.post("/cuentas_asientos", (req, res) => {
    const id_asiento = req.body.id_asiento;

    db.query('SELECT * FROM cuentas_asientos WHERE id_asiento = ? ORDER BY cuenta ASC', [id_asiento], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Error al obtener los detalles de cuentas_asientos' });
        } else {
            res.send(result);
        }
    });
});

app.get("/tipoCuenta", (req, res) => {
    const cuenta = req.query.cuenta;
    db.query('SELECT tipo_cuenta FROM cuentas_contables WHERE cuenta = ?', [cuenta], 
    (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Error al obtener el tipo de cuenta' });
        } else {
            if (result && result.length > 0) {
                res.send({ tipo_cuenta: result[0].tipo_cuenta });
            } else {
                res.status(404).send({ error: 'Cuenta no encontrada' });
            }
        }
    });
});

//----------------------------------------------

// Ruta para validar datos de inicio de sesión
app.post('/login', (req, res) => {
    const usuario = req.body.usuario;
    const contrasenia = req.body.contrasenia;
  
    if (!usuario || !contrasenia) {
      res.status(400).json({ message: 'Campos incompletos' });
      return;
    }
    // Consulta a la base de datos para validar los datos
    db.query("SELECT * FROM usuarios WHERE usuario = ? AND contrasenia = ?", [usuario, contrasenia], 
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Error en el servidor' });
      } else if (results.length === 0) {
        res.status(401).json({ message: 'Credenciales inválidas' });
      } else {
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
      }
    });
  });

app.listen(3001,()=>{
    console.log("Corriendo en el puerto 3001")
})