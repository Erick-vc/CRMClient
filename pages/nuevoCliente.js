import React, { useState } from "react";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const NUEVO_CLIENTE = gql`
  mutation nuevoCliente($input: ClienteInput) {
    nuevoCliente(input: $input) {
      id
      nombre
      apellido
      empresa
      email
      telefono
    }
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

const NuevoCliente = () => {
  const router = useRouter();

  // Mensaje de alerta
  const [mensaje, guardarMensaje] = useState(null);

  // Mutation para crear nuevos clientes
  const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
    update(cache, { data: { nuevoCliente } }) {
      // Obtener el objeto de cache que deseamos actualizar
      const { obtenerClientesVendedor } = cache.readQuery({
        query: OBTENER_CLIENTES_USUARIOS,
      });

      // Reescribimos el cache, porque el cache nunc se debe modificar
      cache.writeQuery({
        query: OBTENER_CLIENTES_USUARIOS,
        data: {
          obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente],
        },
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      empresa: "",
      email: "",
      telefono: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("* El nombre del cliente es obligatorio"),
      apellido: Yup.string().required(
        "* El apellido del cliente es obligatorio"
      ),
      empresa: Yup.string().required("* El campo empresa es obligatorio"),
      email: Yup.string()
        .email("* Email no válido")
        .required("* El email del cliente es obligatorio"),
    }),
    onSubmit: async (valores) => {
      const { nombre, apellido, empresa, email, telefono } = valores;

      try {
        const { data } = await nuevoCliente({
          variables: {
            input: {
              nombre,
              apellido,
              empresa,
              email,
              telefono,
            },
          },
        });
        // console.log(data.nuevoCliente);
        router.push("/inicio");
      } catch (error) {
        guardarMensaje(error.message);

        setTimeout(() => {
          guardarMensaje(null);
        }, 2000);
      }
    },
  });

  const mostrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-2 w-full my-3 max-w-sm text-center mx-auto">
        <p>{mensaje}</p>
      </div>
    );
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gay-800 font-light">Nuevo Cliente</h1>
      {mensaje && mostrarMensaje()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form
            className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}>
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nombre}
              />
            </div>

            {/* Mandar el error del formik */}
            {formik.touched.nombre && formik.errors.nombre ? (
              <p className="mb-4 border-l-4 border-grey-500 text-red-500 text-xs italic">
                {formik.errors.nombre}
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.apellido}
              />
            </div>

            {/* Mandar el error del formik */}
            {formik.touched.apellido && formik.errors.apellido ? (
              <p className="mb-4 border-l-4 border-grey-500 text-red-500 text-xs italic">
                {formik.errors.apellido}
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.empresa}
              />
            </div>

            {/* Mandar el error del formik */}
            {formik.touched.empresa && formik.errors.empresa ? (
              <p className="mb-4 border-l-4 border-grey-500 text-red-500 text-xs italic">
                {formik.errors.empresa}
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </div>

            {/* Mandar el error del formik */}
            {formik.touched.email && formik.errors.email ? (
              <p className="mb-4 border-l-4 border-grey-500 text-red-500 text-xs italic">
                {formik.errors.email}
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.telefono}
              />
            </div>

            <button
              type="submit"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 font-bold cursor:pointer ..."
              value="Iniciar">
              Registrar Cliente
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NuevoCliente;
