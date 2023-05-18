import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";

const OBTENER_USUARIO = gql`
  query obtenerUsuario {
    obtenerUsuario {
      id
      nombre
      apellido
    }
  }
`;

const Header = () => {

  const router = useRouter();

  // query de apollo
  const {data, loading, error} = useQuery(OBTENER_USUARIO);

  // Proteger que no accedamos a data nates de no tener resultados
  if(loading) return null;
  // console.log(data);

  if(data?.obtenerUsuario === null) {
    console.log('estoy en el header')
    return router.push('/');
  }

  const { nombre, apellido } = data.obtenerUsuario;

  const cerrarSesion  = () => {
    localStorage.removeItem('token');
    return router.push('/');
  }

  return (
    <div className="sm:flex justify-between mb-6">
      <p className="mr-2 mb-5 lg:mb-0">Hola: {nombre} {apellido}</p>
      <button 
        onClick={() => cerrarSesion()}
        className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md"
        type="button"
      >
        Cerrar Sesion
      </button>
    </div>
  );
};

export default Header;
