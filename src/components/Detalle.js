import Axios from "axios";
import { useEffect, useState } from "react";

export function Detalle({ ID }) {
  const [listaAsientos, setlistaAsientos] = useState([]);

  useEffect(() => {
    getCuentasAsientos();
    console.log("detalle");
    console.log({ ID });
  }, [ID]);

  const getCuentasAsientos = () => {
    console.log("creo que funciona");
    Axios.post("http://localhost:3001/cuentas_asientos", {
      id_asiento: ID,
    }).then((response) => {
      setlistaAsientos(response.data);
    });
  };

  // Filter rows with values different from 0 for "Debe" or "Haber"
  const filasConValor = listaAsientos.filter(
    (valor) => valor.debe !== 0 || valor.haber !== 0
  );

  // Sort rows by date if needed
  filasConValor.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  return (
    <div className="table-responsive">
      <table className="table table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Cuenta</th>
            <th scope="col">Debe</th>
            <th scope="col">Haber</th>
            <th scope="col">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {filasConValor.map((valor, key) => {
            const fechaFormateada = new Date(valor.fecha).toLocaleDateString(
              "es-AR",
              {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            );
            return (
              <tr className="" key={valor.id}>
                <th>{valor.id_asiento}</th>
                <td>{valor.cuenta}</td>
                <td>{valor.debe}</td>
                <td>{valor.haber}</td>
                <td>{fechaFormateada}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Detalle;