import { useState, useEffect } from "react";
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Suppliers.css";
import Select from "react-select";

export function MenuLibroMayor({setMostrarLibroMayor}) {
    const [cuenta, setCuenta] = useState(null);
    const [listaAsientos, setListaAsientos] = useState([]);
    const [saldo, setSaldo] = useState(0);
    const [datosFinal, setOptions] = useState([]);

    const getTipoCuenta = async (cuenta) => {
        try {
            const response = await Axios.get(`http://localhost:3001/tipoCuenta?cuenta=${cuenta.value}`);
            return response.data.tipo_cuenta;
        } 
        catch (error) {
            console.error(error);
            return null;
        }
    }

    const getCuentas = () => {
        Axios.get("http://localhost:3001/cuentas").then((response) => {
            const datos = response.data.map((valor) => ({
                value: valor.cuenta,
                label: valor.cuenta
            }));
            setOptions(datos);
        });
    }

    useEffect(() => {
        getCuentas();
    }, []);

    useEffect(() => {
        if (cuenta) {
            Axios.get(`http://localhost:3001/libroMayor?cuenta=${cuenta.value}`)
                .then((response) => {
                    const movimientosDebe = response.data.filter((valor) => valor.debe > 0);
                    const movimientosHaber = response.data.filter((valor) => valor.haber > 0);
                    const listaAsientosActualizada = [];
                    let saldoActual = 0;
                    let tipoCuenta;

                    getTipoCuenta(cuenta).then((tipo) => {
                        tipoCuenta = tipo;
                        console.log("tipo de cuenta: ", cuenta);//--------------------
                        console.log("naturaleza de la cuenta: ", tipo)

                        for (let i = 0; i < Math.max(movimientosDebe.length, movimientosHaber.length); i++) {
                            if (i < movimientosDebe.length) {
                                const movimientoDebe = movimientosDebe[i];
                                const debe = movimientoDebe.debe;
                                const haber = movimientoDebe.haber;
                                if (tipoCuenta === "Activo") {
                                    saldoActual += debe - haber;
                                } 
                                else if (tipoCuenta === "Pasivo") {
                                    saldoActual += haber - debe;
                                }
                                else if(tipoCuenta === "R-"){
                                    saldoActual +=debe - haber;
                                }
                                else if(tipoCuenta === "R+"){
                                    saldoActual += haber - debe;
                                }
                                movimientoDebe.saldo = saldoActual;
                                listaAsientosActualizada.push(movimientoDebe);
                            }
                            if (i < movimientosHaber.length) {
                                const movimientoHaber = movimientosHaber[i];
                                const debe = movimientoHaber.debe;
                                const haber = movimientoHaber.haber;
                                if (tipoCuenta === "Activo") {
                                    saldoActual += debe - haber;
                                } else if (tipoCuenta === "Pasivo") {
                                    saldoActual += haber - debe;
                                }
                                else if(tipoCuenta === "R-"){
                                    saldoActual +=debe - haber;
                                }
                                else if(tipoCuenta === "R+"){
                                    saldoActual += haber - debe;
                                }

                                movimientoHaber.saldo = saldoActual;
                                listaAsientosActualizada.push(movimientoHaber);
                            }
                        }
                        setSaldo(saldoActual);
                        setListaAsientos(listaAsientosActualizada);
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            setSaldo(0);
            setListaAsientos([]);
        }
    }, [cuenta]);

    const salirLMayor = () => {
        setMostrarLibroMayor(false);
    }

    return (
        <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
            <div className="card-body">
                <div className="text-center">
                    <h1 className="d-flex align-items-center justify-content-center fs-4 input-group-text">Libro Mayor</h1>
                    {/*<div className="mb-3" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>*/}
                    <div className="d-flex align-items-center"> {/* Envuelve ambos elementos en un div flex */}
                    <Select
                    value={cuenta}
                    className="Supplier-container2"
                    placeholder="Mayor de:"
                    defaultValue={cuenta}
                    onChange={(selectedOption) => {
                        if (!selectedOption) {
                        setCuenta(null);
                        } else {
                        setCuenta(selectedOption);
                        }
                    }}
                    options={datosFinal}
                    isClearable
                    noOptionsMessage={() => "Sin registros"}
                    styles={{
                        control: (styles) => ({
                        ...styles,
                        width: "400px", /* Ajusta el valor según el ancho deseado */
                        height: "40px",
                        minHeight: "40px",
                        }),
                        clearIndicator: (baseStyles, state) => ({
                        ...baseStyles,
                        color: "red",
                        }),
                        dropdownIndicator: () => ({
                        color: "darks",
                        }),
                        menu: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                        }),
                    }}
                    />

                     <button className="btn btn-dark ms-2" onClick={salirLMayor}>Salir</button>
                    </div>
                </div>
                <table className="table table-bordered text-center smaller-table">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">Fecha</th>
                            <th scope="col">N° Asiento</th>
                            <th scope="col">Debe</th>
                            <th scope="col">Haber</th>
                            <th scope="col">Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cuenta || listaAsientos.length > 0 ? (
                            listaAsientos.map((valor, key) => {
                                const fechaFormateada = new Date(valor.fecha).toLocaleDateString("es-AR", {
                                    year: "numeric",
                                    month: "numeric",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                });
                                return (
                                    <tr className="" key={valor.id_asiento}>
                                        <td>{fechaFormateada}</td>
                                        <td>{valor.id_asiento}</td>
                                        <td>{valor.debe}</td>
                                        <td>{valor.haber}</td>
                                        <td className="fw-bold">{valor.saldo}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5">No hay datos para mostrar</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    
    );
}

export default MenuLibroMayor;