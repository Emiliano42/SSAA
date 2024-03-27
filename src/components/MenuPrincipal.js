import {useState, useEffect} from "react";
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import MenuLibroMayor from "./MenuLibroMayor";
import {Detalle} from "./Detalle";
 
export function MenuPrincipal({setMostrarMenuPrincipal,setLogueo}) {
 
    const [listaAsientos,setlistaAsientos] = useState([]);
    const [filtrar, setFiltrar] = useState(false);
 
    const [f_ini, setFIni] = useState('');
    const [f_fin, setFfin] = useState('');

    const [mostrarLibroMayor, setMostrarLibroMayor] = useState(false);
    const [ID_detalle, setID_detalle] = useState("");
    const [mostrarDetalle, setMostrarDetalle] = useState(false);

 
 
    useEffect(() => {
        getAsientos(); // Llamamos a getAsientos al cargar la página
      }, []);
 
    const getAsientos = ()=>{
        Axios.get("http://localhost:3001/asientos",).then((response)=>{
          setlistaAsientos(response.data);
        });
      };
 
    getAsientos();
 
    const cerrarSesion = () => {
        setLogueo(false);
    }
    const registrarAsiento = () => {
        setMostrarMenuPrincipal(false);
    }
    const filtrarFecha = () =>{
        setFiltrar(!filtrar);
    }
    const definirF_ini = (event) => {
        setFIni(event.target.value);
        console.log({f_ini});
      };
    const definirF_fin = (event) => {
        setFfin(event.target.value);
        console.log({f_fin});
    }
 
    const mostrarLMayor = () =>{
        setMostrarLibroMayor(true);
    }

    const showDetalle = (idDetalle) => {
        setID_detalle(idDetalle);
        setMostrarDetalle(!mostrarDetalle);
    }
 
    if(mostrarLibroMayor){
        return  <MenuLibroMayor setMostrarLibroMayor = {setMostrarLibroMayor}/>
    }
    else{
        return(
        <div className="container mt-3 text-center">
            <h1 className="display-8">Asientos</h1>
            <div className="row justify-content-center">

                <input type="datetime-local" id="fechaInicio" onChange={definirF_ini}
                  className="form-control m-2" placeholder="Fecha" aria-label="Username" aria-describedby="basic-addon1"/>

                <input type="datetime-local" id="fechaFin" onChange={definirF_fin}
                className="form-control m-2" placeholder="Fecha" aria-label="Username" aria-describedby="basic-addon1"/>

                <button className="btn btn-dark m-2 btnFiltros" onClick={filtrarFecha}>{!filtrar ? "Filtrar" : "Limpiar Filtro"}</button>

                <button className="btn btn-dark m-2 btnFiltros" onClick={mostrarLMayor}>Libro Mayor</button>

                <button className="btn btn-dark m-2 btnRegistrar" onClick={registrarAsiento}> 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="CornflowerBlue" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg> Registrar Asiento
                </button>
 
                <button type="button" onClick={cerrarSesion} className="btn btn-dark m-2 btnCS"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="Tomato" class="bi bi-arrow-right-square" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                </svg> Cerrar Sesion
                </button>

                <div>{mostrarDetalle && <Detalle ID={ID_detalle} />}</div>
 
                <div className="col-12 mt-1">
                    <div className="table-contenedor">
                        <table className="table table-striped table-hover table-bordered text-center table-fit">
                            <thead className="table-dark">
                                <tr>  {/*"tr" representa una FILA en la tabla */}
                                    <th scope="col">Asiento</th>  {/*"th" su usa para definir el ENCABEZADO de la columna */}
                                    <th scope="col">Fecha</th>
                                    <th scope="col">Descripcion</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
 
                            <tbody>{
                                listaAsientos.slice().map((valor, key)=>{
 
                                const fechaFormateada = new Date(valor.fecha).toLocaleDateString("es-AR", {
                                    year: "numeric",
                                    month: "numeric",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                });
 
                                if ( filtrar ){      //dependera si la variable es True o False
                                    console.log("nose")
                                    if(valor.fecha >= f_ini && valor.fecha <= f_fin){
 
                                       return <tr className="align-middle" key={valor.id}>
                                                <td>{valor.id_asiento}</td> {/*"td" representa el dato dentro de una columna*/}
                                                <td>{fechaFormateada}</td>
                                                <td>{valor.descripcion}</td>
                                                <td>
                                                <button className="btn btn-dark btnVer" onClick={() => showDetalle(valor.id_asiento)} ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="CornflowerBlue" class="bi bi-search" viewBox="0 0 16 16">
                                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                                </svg> Detalle</button>
                                                </td>
                                                </tr> 
                                    }           
                                }
                                else {
                                    return <tr className="align-middle" key={valor.id}>
                                            <td>{valor.id_asiento}</td> {/*"td" representa el dato dentro de una columna*/}
                                            <td>{fechaFormateada}</td>
                                            <td>{valor.descripcion}</td>
                                            <td>
                                            <button className="btn btn-dark btnVer" onClick={() => showDetalle(valor.id_asiento)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="CornflowerBlue" class="bi bi-search" viewBox="0 0 16 16">
                                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                            </svg> Detalle</button>
                                            </td>
                                            </tr>
                                }
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
    
}
export default MenuPrincipal;