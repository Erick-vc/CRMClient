import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const ACTUALIZAR_CLIENTE = gql`
  mutation actualizarCliente($id: ID!, $input: ClienteInput) {
    actualizarCliente(id: $id, input: $input) {
      nombre
      apellido
      empresa
      email
    }
  }
`;

const OBTENER_CLIENTE = gql`
  query obtenerCliente($id: ID!) {
    obtenerCliente(id: $id) {
      nombre
      apellido
      email
      telefono
      empresa
    }
  }
`;

const OBTENER_CLIENTES_USUARIOS = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      nombre
      apellido
      empresa
      email
    }
  }
`;

const EditarCliente = () => {
  //  ?Obtener el id actual
  const router = useRouter();
  const {
    query: { id },
  } = router;

  // console.log(id);

  // ? Consultar para obtener el cliente
  const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
    variables: {
      id,
    },
  });

  // ? Mutation para Actualizar el cliente
  const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE, {
    update(cache, { data: { actualizarCliente } }) {
      // Obtener el objeto cache que deseamos actualizar
      const { obtenerClientesVendedor } = cache.readQuery({
        query: OBTENER_CLIENTES_USUARIOS,
      });
      +(
        // Reescribimos el cache, porque el cache nunca se debe modificar
        cache.writeQuery({
          query: OBTENER_CLIENTES_USUARIOS,
          data: {
            obtenerClientesVendedor: [
              ...obtenerClientesVendedor,
              actualizarCliente,
            ],
          },
        })
      );
    },
  });

  // ? Schema de validacion
  const schemaValidacion = Yup.object({
    nombre: Yup.string().required("* El nombre del cliente es obligatorio"),
    apellido: Yup.string().required("* El apellido del cliente es obligatorio"),
    empresa: Yup.string().required("* El campo empresa es obligatorio"),
    email: Yup.string()
      .email("* Email no válido")
      .required("* El email del cliente es obligatorio"),
  });

  // * También se puede colocar un spinner
  if (loading) return "Cargando...";

  // console.log(data.obtenerCliente);

  const { obtenerCliente } = data;

  // ? Modifica el cliente en la base da datos
  const actualizarInfoCliente = async (valores) => {
    const { nombre, apellido, empresa, email, telefono } = valores;
    try {
      const { data } = await actualizarCliente({
        variables: {
          id: id,
          input: {
            nombre,
            apellido,
            empresa,
            email,
            telefono,
          },
        },
      });
      // console.log(data);

      // TODO: sweet alert
      Swal.fire(
        "Actualizado!",
        "El clente se actualizó correactmente",
        "success"
      );

      // TODO: Redireccionar
      router.push("/inicio");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gay-800 font-light">Editar Cliente</h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik
            validationSchema={schemaValidacion}
            enableReinitialize
            initialValues={obtenerCliente }
            onSubmit={(valores) => {
              actualizarInfoCliente(valores);
            }}>
            {(props) => {
              // console.log(props);
              return (
                <form
                  className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                  onSubmit={props.handleSubmit}>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="nombre">
                      Nombre
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="nombre"
                      type="text"
                      placeholder="Nombre Cliente"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.nombre}
                    />
                  </div>

                  {/* Mandar el error del formik */}
                  {props.touched.nombre && props.errors.nombre ? (
                    <p className="mb-4 border-l-4 border-grey-500 text-red-500 text-xs italic">
                      {props.errors.nombre}
                    </p>
                  ) : null}

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="apellido">
                      Apellido
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="apellido"
                      type="text"
                      placeholder="Apellido Cliente"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.apellido}
                    />
                  </div>

                  {/* Mandar el error del formik */}
                  {props.touched.apellido && props.errors.apellido ? (
                    <p className="mb-4 border-l-4 border-grey-500 text-red-500 text-xs italic">
                      {props.errors.apellido}
                    </p>
                  ) : null}

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="empresa">
                      Empresa
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="empresa"
                      type="text"
                      placeholder="Empresa Cliente"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.empresa}
                    />
                  </div>

                  {/* Mandar el error del formik */}
                  {props.touched.empresa && props.errors.empresa ? (
                    <p className="mb-4 border-l-4 border-grey-500 text-red-500 text-xs italic">
                      {props.errors.empresa}
                    </p>
                  ) : null}

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="email">
                      Email
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="email"
                      type="email"
                      placeholder="Email Cliente"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.email}
                    />
                  </div>

                  {/* Mandar el error del formik */}
                  {props.touched.email && props.errors.email ? (
                    <p className="mb-4 border-l-4 border-grey-500 text-red-500 text-xs italic">
                      {props.errors.email}
                    </p>
                  ) : null}

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="telefono">
                      Telefono
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="telefono"
                      type="tel"
                      placeholder="Telefono Cliente"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.telefono}
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 font-bold cursor:pointer ..."
                    value="Iniciar">
                    Editar Cliente
                  </button>
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default EditarCliente;
