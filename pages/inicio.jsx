// ! este es mi clientes

import Layout from "../components/Layout";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import Cliente from "../components/Cliente";

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

const Index = () => {
  const router = useRouter();

  const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIOS);

  // Consulta de Apollo
  // if(loading) return null;

  if (loading) return "Cargando..";

  // console.log(data);
  if (data.obtenerClientesVendedor === null) {
    return router.push("/");
  }

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gay-800 font-light">Clientes</h1>

        <Link href="/nuevoCliente">
          <div className="w-full lg:w-auto text-center bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 hover:text-gray-200 mb-3 uppercase font-bold">
            Nuevo Cliente
          </div>
        </Link>

        <div className="overflow-x-scroll">
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-gray-800">
              <tr className="text-white">
                <th className="w-1/5">Nombre</th>
                <th className="w-1/5">Empresa</th>
                <th className="w-1/5">Email</th>
                <th className="w-1/5">Eliminar</th>
                <th className="w-1/5">Editar </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {data.obtenerClientesVendedor.map((cliente) => (
                <Cliente key={cliente.id} cliente={cliente} />
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  );
};

export default Index;
