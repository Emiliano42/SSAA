import './App.css';
import {Menu} from "./components/MenuAsientos";
import { Login } from './components/Login';
import { useState } from 'react';
import {MenuPrincipal} from './components/MenuPrincipal';
import { PlanCuentas } from "./components/PlanCuentas"
import {MenuLibroMayor} from './components/MenuLibroMayor';

function App() {

  const [Logueo, setLogueo] = useState(false);
  const [mostrarMenuPrincipal, setMostrarMenuPrincipal] = useState(true);
  const [planCuenta, setPlanCuenta] = useState(false);

  
//------------------
  const [usuario,setUsuario] = useState("");
  const [contrasenia,setContrasenia] = useState("");

  //---------------------


    if (Logueo) {
      // Código a ejecutar si Logueo es verdaderos
      if (mostrarMenuPrincipal) {
        //return <MenuLibroMayor/>
        // Mostrar el menú principal
        return <MenuPrincipal setLogueo={setLogueo} setMostrarMenuPrincipal={setMostrarMenuPrincipal} usuario={usuario} contrasenia={contrasenia}/>;
      }
      else {

        if(planCuenta){
          return <PlanCuentas setPlanCuenta={setPlanCuenta} usuario={usuario} contrasenia={contrasenia}/>;
        }
        else{
          // Mostrar otro componente (puedes cambiar esto según tus necesidades)
          return <Menu setMostrarMenuPrincipal={setMostrarMenuPrincipal} setPlanCuenta={setPlanCuenta} usuario={usuario} contrasenia={contrasenia}/>;
        }
        
      }
    } 
    else {
      // Código a ejecutar si Logueo es falso
      return (
        <Login setLogueo={setLogueo} usuario={usuario} contrasenia={contrasenia} setUsuario={setUsuario} setContrasenia={setContrasenia} />
      );
    }
  }
export default App;