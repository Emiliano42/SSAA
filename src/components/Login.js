import "./Login.css";
//import React, {useState} from "react";
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import Axios from "axios";

export function Login ({setLogueo, usuario, contrasenia, setUsuario, setContrasenia}){




    
    const validarDatos = () => {
        if (!usuario || !contrasenia) {
          Swal.fire({
            title: 'Error',
            text: 'Por favor, complete todos los campos para iniciar sesión.',
            confirmButtonText: 'Salir',
            icon: 'error',
          });
          return;
        }
        Axios.post('http://localhost:3001/login', {
          usuario,
          contrasenia,
        })
          .then(() => {
            // Datos válidos, hacer algo (por ejemplo, redirigir a otra página)
            Swal.fire({
                title: 'Éxito',
                text: 'Inicio de sesión exitoso',
                timer: 800,
                icon: 'success',
            });
                  // Establecer setLogueo(true) después de 2 segundos
            setTimeout(() => {
                setLogueo(true);
                }, 1000); // 1500 milisegundos = 1.5 segundos
        })
          .catch((error) => {
            Swal.fire({
              title: 'Error',
              text: 'Credenciales inválidas',
              timer: 1500,
              confirmButtonText: 'Entiendo',
              icon: 'warning',
            });
          });
      };
    return (
        <div className="login-box">
        <h3 className="tituloLognIn">Sistema de Logueo</h3>
        <div className="input-group mb-2 w-15">
            <span className="input-group-text" id="basic-addon1">Usuario:</span>
            <input type="text" value={usuario}
            onChange={(event)=>{
            setUsuario(event.target.value);
            }}
            className="form-control" placeholder="Ingrese nombre" aria-label="usuario" aria-describedby="basic-addon1"/>
        </div>
        <div className="input-group mb-2 w-15">
            <span className="input-group-text" id="basic-addon1">Contraseña:</span>
            <input type="password" value={contrasenia} 
            onChange={(event)=>{
                setContrasenia(event.target.value);
                }}
            className="form-control" placeholder="Ingrese contraseña" aria-label="contrasenia" aria-describedby="basic-addon1"/>
        </div>
        <button className="btn btn-dark mx-3 px-4" onClick={validarDatos}>Iniciar Sesión</button>
        </div>
    )
    }


