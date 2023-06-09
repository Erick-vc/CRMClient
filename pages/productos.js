import React from "react";
import Layout from "../components/Layout";
import { gql, useQuery } from "@apollo/client";
import Producto from "../components/Producto";
import Link from "next/link";

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      precio
      existencia
    }
  }
`;

const Productos = () => {
  // ? Consultar los produtos
  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

  if (loading) return "Cargando...";

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gay-800 font-light">Productos</h1>

        <Link href="/nuevoProducto">
          <div className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 hover:text-gray-200 mb-3 uppercase font-bold">
            Nuevo Producto
          </div>
        </Link>

        <div className="overflow-x-scroll">
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-gray-800">
              <tr className="text-white">
                <th className="w-1/5">Nombre</th>
                <th className="w-1/5">Existencia</th>
                <th className="w-1/5">Precio</th>
                <th className="w-1/5">Eliminar</th>
                <th className="w-1/5">Editar </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {data.obtenerProductos.map((producto) => (
                <Producto key={producto.id} producto={producto} />
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  );
};

export default Productos;
