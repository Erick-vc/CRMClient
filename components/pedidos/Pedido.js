import React, { useState, useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";

const ACTUALIZAR_PEDIDO = gql`
  mutation actualizarPedido($id: ID!, $input: PedidoInput) {
    actualizarPedido(id: $id, input: $input) {
      estado
    }
  }
`;

const ELIMINAR_PEDIDO = gql`
  mutation eliminarPedido($id: ID!) {
    eliminarPedido(id: $id)
  }
`;

const OBTENER_PEDIDOS = gql`
  query obtenerPedidosVendedor {
    obtenerPedidosVendedor {
      id
    }
  }
`;

const Pedido = ({ pedido }) => {
  const {
    id,
    total,
    cliente: { nombre, apellido, telefono, email },
    estado,
    cliente,
  } = pedido;

  // Mutation para cambiar el estado de un pedido
  const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO);

  // Mutation para eliminar un pedido por id
  const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO, {
    update(cache) {
      // Vamos a obtener una copia del objeto de cache
      const { obtenerPedidosVendedor } = cache.readQuery({
        query: OBTENER_PEDIDOS,
      });

    // Reescribir el cache
    cache.writeQuery({
      query: OBTENER_PEDIDOS,
      data: {
        obtenerPedidosVendedor: obtenerPedidosVendedor.filter(
          (pedidoActual) => pedidoActual.id !== id
        ),
      }
    })
    }
  });

  const [estadoPedido, setEstadoPedido] = useState(estado);
  const [clase, setClase] = useState("");

  // ? Para cuando cambiemos se esté actualizando
  useEffect(() => {
    if (estadoPedido) {
      setEstadoPedido(estadoPedido);
    }
    clasePedido();
  }, [estadoPedido]);

  // ? Modifica el color del pedido de acuerdo a su estado
  const clasePedido = () => {
    if (estadoPedido === "PENDIENTE") {
      setClase("border-yellow-500");
    } else if (estadoPedido === "COMPLETADO") {
      setClase("border-green-500");
    } else {
      setClase("border-red-800");
    }
    // switch (estadoPedido) {
    //   case 'PENDIENTE':
    //     setClase('border-yellow-500')
    //     break;
    //   case 'COMPLETADO':
    //     setClase('border-green-500')
    //     break;
    //   case 'CANCELADO':
    //     setClase('border-red-800')
    //     break;
    //   default:
    //     break;
    // }
  };

  const cambiarEstadPedido = async (nuevoEstado) => {
    try {
      const { data } = await actualizarPedido({
        variables: {
          id,
          input: {
            estado: nuevoEstado,
            cliente: cliente.id,
          },
        },
      });
      setEstadoPedido(data.actualizarPedido.estado);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmarEliminarPedido = () => {
    Swal.fire({
      title: "¿Deseas eliminar este pedido?",
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
          const { data } = await eliminarPedido({
            variables: {
              id,
            },
          });
          console.log(data);
          // ? Mostrar una alera

          Swal.fire("Eliminado!", "El pedido ha sido eliminado", "success");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  return (
    <div
      className={` ${clase} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
      <div>
        <p className="font-bold text-gray-800">
          Cliente: {nombre} {apellido}
        </p>
        {email && (
          <p className="flex items-center my-2">
            <svg
              className="w-4 h-4 mr-2 mt-1 "
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path>
            </svg>
            {email}
          </p>
        )}

        {telefono && (
          <p className="flex items-center my-2">
            <svg
              className="w-4 h-4 mr-2 mt-1 "
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"></path>
            </svg>
            {telefono}
          </p>
        )}
        <h2 className="text-gray-800 font-bold mt-10">Estado Pedido</h2>
        <select
          className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercarse text-xs font-bold"
          value={estadoPedido}
          onChange={(e) => cambiarEstadPedido(e.target.value)}>
          <option value="COMPLETADO">COMPLETADO</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="CANCELADO">CANCELADO</option>
        </select>
      </div>

      <div>
        <h2 className="text-gray-800 font-bold mt-2">Resumen del Pedido</h2>
        {pedido.pedido.map((articulo) => (
          <div className="mt-4" key={articulo.id}>
            <p className="text-sm text-gray-600">
              Producto: {articulo.nombre}{" "}
            </p>
            <p className="text-sm text-gray-600">
              Cantdad: {articulo.cantidad}{" "}
            </p>
          </div>
        ))}
        <p className="text-gray-800 mt-3 font-bold">
          Total a pagar:
          <span className="font-light"> $ {total}</span>
        </p>
        <button
          className="uppercase text-xs font-bold flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight"
          onClick={() => confirmarEliminarPedido()}>
          Eliminar Pedido
          <AiOutlineCloseCircle className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Pedido;
