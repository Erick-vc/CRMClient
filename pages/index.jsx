/// ESTE EL LOGIN

import React, { useState } from "react";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const AUTENTICAR_USUARIO = gql`
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;

const Login = () => {
  // ? State
  const [btn, bloquearBtn] = useState(false);
  const [mensaje, guardarMensaje] = useState(null);

  // ? Mutation para crear nuevos usuarios en apollo
  const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);

  // ? routing
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("* El email no es valido")
        .required("* El email no puede ir vacio"),
      password: Yup.string().required("* El password es obligatorio"),
    }),
    onSubmit: async (valores) => {
      // console.log(valores);
      const { email, password } = valores;

      try {
        const { data } = await autenticarUsuario({
          variables: {
            input: {
              email: email,
              password: password,
            },
          },
        });
        console.log(data);
        bloquearBtn(true);
        guardarMensaje("Autenticando ...");

        // Guardar el toekn en localstores

        setTimeout(() => {
          const { token } = data.autenticarUsuario;
          
          localStorage.setItem("token", token);
        }, 1000);

        // Redirigir a clientes
        setTimeout(() => {
          router.push("/inicio");
          guardarMensaje(null);
        }, 2000);
      } catch (error) {
        guardarMensaje(error.message);
        // console.log(error);

        setTimeout(() => {
          guardarMensaje(null);
        }, 2000);
      }
    },
  });

  const mostrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-2 w-full my-3 max-w-sm 
      text-center mx-auto">
        <p>{mensaje}</p>
      </div>
    );
  };

  return (
    <>
      <Layout>
        <h1 className="text-center text-2xl text-white font-light">Login</h1>

        {mensaje && mostrarMensaje()}

        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
            <form
              className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}>
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
                  placeholder="Email Usuario"
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

              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password">
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Password Usuario"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
              </div>

              {/* Mandar el error del formik */}
              {formik.touched.password && formik.errors.password ? (
                <p className="mt-4 border-l-4 border-grey-500 text-red-500 text-xs italic">
                  {formik.errors.password}
                </p>
              ) : null}

              {/* <input 
                type="submit"
                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 cursor:pointer ..."
                value="Iniciar Sesión"
              /> */}

              {!btn ? (
                <button
                  type="submit"
                  className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 cursor:pointer ..."
                  value="Iniciar">
                  Iniciar Sesión
                </button>
              ) : (
                <button
                  disabled={true}
                  className="bg-gray-800 w-full mt-5 p-2 text-white uppercase opacity-50 cursor-not-allowed">
                  Iniciar Sesión
                </button>
              )}
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Login;
