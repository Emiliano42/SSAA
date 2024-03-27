import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Suppliers.css";
import { useState } from "react";
import { useEffect } from "react";
import { AgregarCuenta } from "./AgregarCuenta"
import Swal from 'sweetalert2';


export function PlanCuentas({setPlanCuenta, usuario, contrasenia}){


    const [datosPlanCuentas,setDatosPlanCuentas] = useState([]);
    const [mostrarAgregarCuenta, setMostrarAgregarCuenta] = useState(false);




//------------------------------------------
    const [esAdmin, setEsAdmin] = useState(""); //Usamos esta constante para saber a quien mostrar el boton "Agregar Cuenta"

    useEffect(() => {
        Axios.post("http://localhost:3001/admin",{usuario:usuario , contrasenia:contrasenia})
        .then((response) => {
        //console.log("Usuario:" ,usuario,contrasenia)
        //console.log("Admin?:" , response.data[0].admin) //Con el [0] especifico que solo me de el primer elemento del Array y con "admin" el admin (1 o 0)
        if(response.data[0].admin){
            setEsAdmin(true);
        }
        else{
            setEsAdmin(false);
        }
        });
    }, [usuario, contrasenia, setEsAdmin]);

// -----------------------







    useEffect(() => {
        getPlanCuentas(); // Llamamos a getPlanCuentas al cargar la página, Pq? Porque si no hay nadie que traiga los datos
      }, [mostrarAgregarCuenta]);


    const getPlanCuentas = ()=>{
        Axios.get("http://localhost:3001/planCuentas",).then((response)=>{
          setDatosPlanCuentas(response.data);
        });
      };

    const salir = () =>{
        setPlanCuenta(false);
    }
    
    const agregarCuenta = () =>{ //Se habilita para mostrar el componente "AgregarCuenta"
            setMostrarAgregarCuenta(true);
        }

    const borrarCuenta = () =>{
        Swal.fire({
            title: "<strong>Funcion no disponible en la version BETA</strong>",
            //html: "<i>¡La Cuenta <strong>"+nomCuenta+"</strong> fue registrada con exito!</i>",
            icon: 'info',
            timer: 3500
        })
    }



    
    
    
    return(

        <div className="container mt-3 text-center">
            <h1 className="display-8">Plan de Cuentas</h1>
            <button className="btn btn-dark m-2 btnFiltros" onClick={salir}>Salir</button>
            {esAdmin && (<button className="btn btn-dark ms-2" onClick={agregarCuenta}>Agregar Cuenta</button>)}
            {esAdmin && (<button className="btn btn-dark ms-2" onClick={borrarCuenta}>Borrar Cuenta</button>)}

            <div>{mostrarAgregarCuenta && <AgregarCuenta setMostrarAgregarCuenta={setMostrarAgregarCuenta} />}</div>

            <div>
                <div className="col-12 mt-1">
                <div className="table-contenedor">
                    <table className="table table-striped table-hover table-bordered text-center table-fit">
                        <thead className="table-dark">
                            <tr>  {/*"tr" representa una FILA en la tabla */}

                            <th scope="col">N° de Cuenta</th>  {/*"th" su usa para definir el ENCABEZADO de la columna */}
                            <th scope="col">Cuenta</th>  
                            <th scope="col">Tipo de cuenta</th>
                            <th scope="col">Admite saldo</th>
                            </tr>
                        </thead>

                        <tbody>{
                            datosPlanCuentas.slice().map((valor, key) => {
                                
                                const admiteSaldo = valor.admite_Saldo ? "si" : "no";

                            return(
                                <tr className="align-middle" key={valor.id}>

                                    <td>{valor.id}</td> {/*"td" representa el dato dentro de una columna*/}
                                    <td>{valor.cuenta}</td>
                                    <td>{valor.tipo_cuenta}</td>
                                    <td>{admiteSaldo}</td>
                                </tr>
                            )
                            })
                        }
                        </tbody>
                    </table>
                </div>
                </div>
            </div>
        </div>


    );


}

export default PlanCuentas;