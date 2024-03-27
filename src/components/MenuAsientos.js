import {useState, useEffect} from "react";
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import "./Suppliers.css";
import Select from "react-select";
//import {usuario,contrasenia} from "./Login";


export function Menu({setMostrarMenuPrincipal,setPlanCuenta}) {

  const [asiento,setAsiento] = useState(1);
  const fechaActual = new Date();
  const year = fechaActual.getFullYear();
  const month = (fechaActual.getMonth() + 1).toString().padStart(2, "0");
  const day = fechaActual.getDate().toString().padStart(2, "0");
  const hour = fechaActual.getHours().toString().padStart(2, "0");
  const minutes = fechaActual.getMinutes().toString().padStart(2, "0");
  
  const fechaFormateada = `${year}-${month}-${day}T${hour}:${minutes}`;
  const [fecha,setFecha] = useState(fechaFormateada);
  const [descripcion,setDescripcion] = useState("");
  const [cuenta,setCuenta] = useState(null);
  const [monto,setMonto] = useState("");
  const [debeSelected, setDebeSelected] = useState(false);
  const [haberSelected, setHaberSelected] = useState(false);

  const [listaAsientos,setlistaAsientos] = useState([]);

// -----------------------------
  const [datosAsiento, setDatosAsiento] = useState(null);

  useEffect(() => {
    Axios.get("http://localhost:3001/datosAsiento")
      .then((response) => {
        const resultado = response.data[0].hayDatos;
        setDatosAsiento(resultado);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //-------------------------------

  const cancelarRegistro = () => {
    setMostrarMenuPrincipal(true);
    limpiarDBCuenta();
    resetearIdBd();
}

const limpiarDBCuenta= () => {
  Axios.put("http://localhost:3001/limpiarRegistroCuentas")
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
};

const resetearIdBd= () => {
  Axios.put("http://localhost:3001/resetearId")
    .then((response) => {
      console.log(response.data)
    })
    .catch((error) => {
      console.error(error);
    });
};

const moverCuentas= () => {
  Axios.post("http://localhost:3001/agregarCuentasAsiento", {id_asiento:asiento , fecha : fecha})
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
};



  const handleDebeChange = () => {
    setDebeSelected(true);
    setHaberSelected(false);
  };

  const handleHaberChange = () => {
    setHaberSelected(true);
    setDebeSelected(false);
  };
//-------------
  
//-------------------


  useEffect(() => {
    async function fetchNuevoValor() {
      try {
        const response = await Axios.get("http://localhost:3001/numAsiento");
        setAsiento(response.data[0].id_asiento+1); // Accede al valor del resultado
      } catch (error) {
        console.error(error);
      }
    }

    fetchNuevoValor();
  }, []);

  const getCuentas = ()=>{
    Axios.get("http://localhost:3001/cuentas",).then((response)=>{
        const datos = response.data.map((valor) => ({
            value: valor.cuenta,
            label: valor.cuenta
        }));
    setOptions(datos)
    });}

  useEffect(() => {
    getAsientos(); // Llamamos a getAsientos al cargar la página
    getCuentas(); // Llamamos a getCuentas al cargar la página

  }, []);
  
  const [datosFinal, setOptions] = useState([]);

const registrarCuenta = ()=>{
  Swal.fire({
    title: 'Nombre de la cuenta',
    input: 'text',
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
    inputValidator: (value) => {
      if (!value) {
        return 'Este campo no puede estar vacío.'
      }
    }
  }).then((result)=>{
    if (result.dismiss===Swal.DismissReason.cancel){
      console.log("se cancelo la opcion")
    }else if (result.value){
      if (result.value.trim() === '') {
        console.log('El campo está vacío');
      }else {
        console.log(result.value)
        Axios.post("http://localhost:3001/crearCuenta",{
          cuenta:result.value,
        }).then(()=>{
          getCuentas();
        });
      }
    }
  });
};

 const registrarAsiento = ()=>{
    const sumaDebe = listaAsientos.reduce((total, valor) => total + valor.debe, 0);
    const sumaHaber = listaAsientos.reduce((total, valor) => total + valor.haber, 0);
    
    if (!asiento || !descripcion || !fecha) {
      // Al menos uno de los campos está vacío, mostrar mensaje de error
      Swal.fire({
        title: 'Error',
        text: 'Por favor, complete todos los campos antes de registrar el asiento.',
        confirmButtonText: "Salir",
        icon: 'error',
      });
      return; // Detener la función aquí si hay campos vacíos
    }
//-----------------------------------------------
    
    if(datosAsiento === 0){ //Si no hay cuentas cargados no se puede registrar un asiento
      console.log("cagada")
      Swal.fire({
        title: 'Error',
        text: 'No se puede registrar un asiento con campos vacios.',
        confirmButtonText: "Salir",
        icon: 'error',
      });

      return;
    }
//---------------------------------------------------
    if (sumaDebe - sumaHaber === 0) {
      // Realizar la operación deseada si la validación es exitosa
      Axios.post("http://localhost:3001/create",{
        id_asiento:asiento,
        descripcion:descripcion,
        fecha: fecha,
      }).then(()=>{
        getAsientos();
        //getCuentas();
        vaciarCampos();
        mandarCuentas();
        moverCuentas();
        limpiarDBCuenta();
        resetearIdBd();
        Swal.fire({
          title: "<strong>Registro Exitoso</strong>",
          html: "<i>¡El Asiento número <strong>"+asiento+"</strong> fue registrado con exito!</i>",
          icon: 'success',
          timer: 1500
        })
      });
      // agrego un temporizador para el cambio al otro componente
      // Cambia al MenuPrincipal después de 1 segundo
      setTimeout(() => {
        setMostrarMenuPrincipal(true);
      }, 1800);
    }else{
      Swal.fire({
        title: 'Error',
        text: 'El saldo del asiento debe quedar en 0.',
        confirmButtonText: "Salir",
        icon: 'error',
      });
      return; // Detener la función aquí si no concuerdan los valores del debe y el haber
    }};




  const registrarCuentaAsiento = ()=>{

    if (!cuenta) {
      // Al menos uno de los campos está vacío, mostrar mensaje de error
      Swal.fire({
        title: 'Error',
        text: 'Por favor, complete todos los campos antes de agregar la cuenta.',
        confirmButtonText: "Salir",
        icon: 'error',
      });
      return; // Detener la función aquí si hay campos vacíos
    }
    Axios.post("http://localhost:3001/createAcc",{
      cuenta: cuenta.value,
      monto: monto,
      debe: debeSelected ? monto : null,
      haber: haberSelected ? monto : null,
      fecha: fecha,
    }).then(()=>{
      getAsientos();
      //getCuentas();
      vaciarCamposCuenta();
      Axios.get("http://localhost:3001/datosAsiento")
      .then((response) => {
            const resultado = response.data[0].hayDatos;
            setDatosAsiento(resultado);
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);
  }

  const vaciarCamposCuenta = ()=>{
    setCuenta(null);
    setMonto(0);
  }

  const vaciarCampos = ()=>{
    setAsiento("");
    setFecha("");
    setDescripcion("");
    setCuenta(null);
  }

  const getAsientos = ()=>{
    Axios.get("http://localhost:3001/cuentas2",).then((response)=>{
      setlistaAsientos(response.data);
    });
  }
//---------------------------
  const mandarCuentas = () =>{
    Axios.post("http://localhost:3001/agregarCuentasAsiento",{
      id_asiento: asiento,
      fecha: fecha,
    }).then(()=>{
      console.log("hola prueba")
    });
  }

 





  
// -----------------------

const mostrarPlanCuentas = () => {
  console.log("PlanDeCuentas");
  setPlanCuenta(true); // Cambiar el estado para mostrar el componente
};
//------------------------

  
  return (
    <div className="container mt-3">
    <div className="card text-center">
      <div className="card-header">Registrar Asiento
      </div>
      <div className="card-body">
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">N° Asiento:</span>
          <input className="contenedor-bloqueo form-control" type="text" value={asiento} 
          placeholder="Numero" aria-label="Username" aria-describedby="basic-addon1" readOnly/>
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Fecha:</span>
          <input type="datetime-local" value={fecha}
            className="contenedor-bloqueo form-control" placeholder="Fecha" aria-label="Username" aria-describedby="basic-addon1" readOnly/>
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Descripcion:</span>
          <input type="textarea" value={descripcion}
            onChange={(event)=>{
              setDescripcion(event.target.value);
              }}
          className="form-control" placeholder="Ingrese detalle" aria-label="Username" aria-describedby="basic-addon1"/>
        </div>
        <div>
          <span className="input-group-text" id="basic-addon1">Cuenta: 
          <Select value={cuenta} className="Supplier-container" placeholder="Seleccionar cuenta"
            defaultValue={cuenta}
            onChange={setCuenta}
            options={datosFinal}
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
            <span className="monto-div" id="basic-addon3">Monto:</span>
            <input type="number" value={monto}
              onChange={(event)=>{
                setMonto(event.target.value);
            }}className="form-control m-1" placeholder="Monto" aria-label="Monto" aria-describedby="basic-addon1"/>
            <input type="radio" value={monto}
              onChange={handleDebeChange}
              checked={debeSelected}/>
            <span className="debe-div m-1" id="basic-addon5">Debe</span>
            <input type="radio" value={monto}
              onChange={handleHaberChange}
              checked={haberSelected}/>
            <span className="haber-div m-1" id="basic-addon5">Haber</span>
            <button className="btn btn-dark ms-2" onClick={registrarCuentaAsiento}>Agregar</button>
            <button className="btn btn-dark ms-2" onClick={mostrarPlanCuentas}> Plan de Cuentas</button>
            {/*{esAdmin && (<button className="btn btn-dark ms-2" onClick={registrarCuenta}>Agregar Cuenta</button>)}*/}
           </span>
        </div>
      </div>
      <div className="card-footer text-body-secondary">
      <button className="btn btn-dark m-1" onClick={cancelarRegistro}>Cancelar</button>
      <button className="btn btn-dark m-1" onClick={registrarAsiento}>Registrar Asiento</button>
      </div>

    </div>
    <div className="table-responsive">
      <table className="table table-bordered text-center">
        <thead className="table-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Cuenta</th>
          <th scope="col">Debe</th>
          <th scope="col">Haber</th>
        </tr>
      </thead>
      <tbody>
        {
          listaAsientos.slice().map((valor, key)=>{
            const cuentaClass = valor.haber > 0 ? "text-end" : "";
            return <tr className="" key={valor.id}>
                    <th>{valor.id}</th>
                    <td className={cuentaClass}>{valor.cuenta}</td>
                    <td>{valor.debe}</td>
                    <td>{valor.haber}</td>
                  </tr>
          })
            }
      </tbody>
      </table>
    </div>
  </div>
  );
}

export default Menu;
