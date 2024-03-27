import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Suppliers.css";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import Select from "react-select";


export function AgregarCuenta({setMostrarAgregarCuenta}){


    const [idCuenta, setIdCuenta] = useState("");
    const [nomCuenta, setNomCuenta] = useState("");
    const [tipoCuenta, setTipoCuenta] = useState("");
    const [admiteSaldo, setAdmiteSaldo] = useState("");


    const salirAgreCuenta = () =>{
        setMostrarAgregarCuenta(false);
    }

    const opciones2 = [
        { value: "Activo", label: "Activo" },
        { value: "Pasivo", label: "Pasivo" },
        { value: "Patrimonio", label: "Patrimonio" },
        { value: "R+", label: "R+" },
        { value: "R-", label: "R-" },
      ];
   
    const opciones = [ //Opciones que el usuario nos diga si la cuenta admite saldo o no
        { value: 1, label: "Sí" },
        { value: 0, label: "No" },
      ];

    const registrarCuenta = ()=>{

        if (!idCuenta || !nomCuenta || !tipoCuenta || !admiteSaldo) {
          // Al menos uno de los campos está vacío, mostrar mensaje de error
          Swal.fire({
            title: 'Error',
            text: 'Por favor, complete todos los campos antes de registrar una cuenta.',
            confirmButtonText: "Salir",
            icon: 'error',
          });
          return; // Detener la función aquí si hay campos vacíos
        }
        else{
            Axios.post("http://localhost:3001/crearCuenta",{
                id_cuenta:idCuenta,
                nomCuenta:nomCuenta,
                tipoCuenta: tipoCuenta.value,
                admiteSaldo: admiteSaldo.value,
            }).then(()=>{
                Swal.fire({
                    title: "<strong>Registro Exitoso</strong>",
                    html: "<i>¡La Cuenta <strong>"+nomCuenta+"</strong> fue registrada con exito!</i>",
                    icon: 'success',
                    timer: 3000
                })
                salirAgreCuenta();

            })
        }
    }

   

    useEffect(() =>{
      //  console.log("admite saldo: ", admiteSaldo.value)  NO NOS PERMITE MOSTRAR UN VALOR NULO POR CONSOLA, POR LO QUE CUANDO 
        //console.log("tipo de cuenta: ", tipoCuenta.value) EL USUARIO CANCELA LA OPCION SELECCIONADA NOS VA A SALTAR ERROR


    },[admiteSaldo,tipoCuenta])






    return(

        <div className="container mt-3">
        <div className="card text-center">
            <div className="card-header">Agregar Cuenta</div>
            <div className="card-body">

                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">N° de Cuenta:</span>
                    <input type="text" value={idCuenta}
                        onChange={(event)=>{
                            setIdCuenta(event.target.value);
                        }}
                    className="form-control" placeholder="ID de la cuenta" aria-label="Username" aria-describedby="basic-addon1"/>
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Cuenta:</span>
                    <input type="text" value={nomCuenta}
                        onChange={(event)=>{
                            setNomCuenta(event.target.value);
                        }}
                    className="form-control" placeholder="Nombre de la Cuenta" aria-label="Username" aria-describedby="basic-addon1"/>
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Tipo de Cuenta:</span>
                    <Select 
                    //value={admiteSaldo}
                    className="Supplier-container"
                    placeholder="Naturaleza de la Cuenta"  //Lo que se ve en el cuadro antes de seleccionar una opcion
                    //defaultValue={admiteSaldo}
                    onChange={(selectedOption) => setTipoCuenta(selectedOption)}
                    options={opciones2}
                    isClearable
                    //isSearchable -> Si queremoss que se pueda buscar la activamos
                    //isDisabled -> Si queremoss que no se pueda modificar la activamos
                    noOptionsMessage={() => "Sin registros"}
                    styles={{
                        clearIndicator: (baseStyles, state) =>({
                            ...baseStyles,
                            color: "red"
                        }),
                        dropdownIndicator: () =>({
                            color: "darks"
                        })
                    }}/>

                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Admite Saldo:</span>
                    <Select 
                    //value={admiteSaldo}
                    className="Supplier-container"
                    placeholder="Admite Saldo?"
                    //defaultValue={admiteSaldo}
                    onChange={(selectedOption) => setAdmiteSaldo(selectedOption)}
                    options={opciones}
                    isClearable
                    //isSearchable -> Si queremoss que se pueda buscar la activamos
                    //isDisabled -> Si queremoss que no se pueda modificar la activamos
                    noOptionsMessage={() => "Sin registros"}
                    styles={{
                        clearIndicator: (baseStyles, state) =>({
                            ...baseStyles,
                            color: "red"
                        }),
                        dropdownIndicator: () =>({
                            color: "darks"
                        })
                    }}/>

                </div>

                <div className="card-footer text-body-secondary">
                    <button className="btn btn-dark m-1" onClick={salirAgreCuenta}>Cancelar</button>
                    <button className="btn btn-dark m-1" onClick={registrarCuenta}>Registrar Cuenta</button>
                </div>
            </div>
        </div>
        </div>




    );


}

export default AgregarCuenta;