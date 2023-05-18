import React from "react";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import Swal from 'sweetalert2';
import { useRouter } from "next/router";

const NUEVO_PRODUCTO = gql`
  mutation nuevoProducto($input: ProductoInput) {
    nuevoProducto(input: $input) {
      id
      nombre
      precio
      existencia
    }
  }
`;

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

const NuevoProducto = () => {

  const router = useRouter();

  // Mutation de apollo
  const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
    update(cache, {data: {nuevoProducto}}) {
      // Obtener el objeto de cache que deseamos actualizar
      const {obtenerProductos} = cache.readQuery({
        query: OBTENER_PRODUCTOS,
      });

      // Reescribimos el cache
      cache.writeQuery({
        query: OBTENER_PRODUCTOS,
        data: {
          obtenerProductos: [...obtenerProductos, nuevoProducto]
        },
      })
    }
  });


  // Formulario para nuevo producto
  const formik = useFormik({
    initialValues: {
      nombre: "",
      existencia: "",
      precio: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("* El nombre del producto es obligatorio"),
      existencia: Yup.number()
        .required("* Agrega la cantidad disponible")
        .positive("* No se aceptan numeros negativos")
        .integer("* La existencia debe ser numeros enteros"),
      precio: Yup.number()
        .required("* El precio es obligatorio")
        .positive("* No se aceptan nuevos negativos"),
    }),
    onSubmit: async valores => {
      const { nombre, existencia, precio } = valores;
      try {
        const {data} = await nuevoProducto({
          variables: {
            input: {
              nombre,
              existencia,
              precio
            }
          }
        });
        // console.log(data);
        // ? Mostrar una alerta
        Swal.fire(
          'Creado',
          'Se creo el producto correctamente',
          'success'
        )

        // ? Redireccionar hacia los productos
          router.push('/productos');
      } catch (error) {
        console.log(error)
      }
    }
  });



  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">
        Crear nuevo Producto
      </h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form
            className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
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
                placeholder="Nombre Producto"
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
                htmlFor="existencia">
                Cantidad Disponible
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="existencia"
                type="number"
                placeholder="Cantidad Disponible"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.existencia}
              />
            </div>

            {/* Mandar el error del formik */}
            {formik.touched.existencia && formik.errors.existencia ? (
              <p className="mb-4 border-l-4 border-grey-500 text-red-500 text-xs italic">
                {formik.errors.existencia}
              </p>
            ) : null}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="precio">
                Prcio
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="precio"
                type="number"
                placeholder="Precio Producto"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.precio}
              />
            </div>

            {/* Mandar el error del formik */}
            {formik.touched.precio && formik.errors.precio ? (
              <p className="mb-4 border-l-4 border-grey-500 text-red-500 text-xs italic">
                {formik.errors.precio}
              </p>
            ) : null}

            <button
              type="submit"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 font-bold cursor:pointer ..."
              value="Iniciar">
              Agregar nuevo Producto
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NuevoProducto;
