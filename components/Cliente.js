// ! este es mi mostrarclientes

import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Swal from "sweetalert2";
import { gql, useMutation } from "@apollo/client";
import Router from "next/router";

const ELIMINAR_CLIENTE = gql`
  mutation eliminarCliente($id: ID!) {
    eliminarCliente(id: $id)
  }
`;

const OBTENER_CLIENTES_USUARIOS = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
    }
  }
`;

const Cliente = ({ cliente }) => {
  // mutation para eliminar cliente
  const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
    update(cache) {
      // obtener una copia del objeto de cache
      const { obtenerClientesVendedor } = cache.readQuery({
        query: OBTENER_CLIENTES_USUARIOS,
      });

      // Reescribir el cache
      cache.writeQuery({
        query: OBTENER_CLIENTES_USUARIOS,
        data: {
          obtenerClientesVendedor: obtenerClientesVendedor.filter(
            (clienteActual) => clienteActual.id !== id
          ),
        },
      });
    },
  });

  const { nombre, apellido, empresa, email, id } = cliente;

  // Elimina un cliente
  const confirmarEliminarCliente = () => {
    Swal.fire({
      title: "¿Deseas eliminar este cliente?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
      cancelButtonText: "No, Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // ? Eliminar por ID
          const { data } = await eliminarCliente({
            variables: {
              id,
            },
          });
          console.log(data);
          // ? Mostrar una alera

          Swal.fire("Eliminado!", "El clente ha sido eliminado", "success");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const editarCliente = () => {
    Router.push({
      pathname: "/editarcliente/[id]",
      query: { id },
    });
  };

  return (
    <tr key={cliente.id}>
      <td className="border px-4 py-2">
        {nombre} {apellido}
      </td>
      <td className="border px-4 py-2">{empresa}</td>
      <td className="border px-4 py-2">{email}</td>
      <td className="border px-4 py-2">
        <button
          type="button"
          className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
          onClick={() => confirmarEliminarCliente()}>
          Eliminar
          <AiOutlineCloseCircle className="w-4 h-4 ml-2" />
        </button>
      </td>
      <td className="border px-4 py-2">
        <button
          type="button"
          className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
          onClick={() => editarCliente()}>
          Editar
          <svg
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="w-4 h-4 ml-2">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default Cliente;
