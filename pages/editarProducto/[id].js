import React from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const OBTENER_PRODUCTO = gql`
  query obtenerProducto($id: ID!) {
    obtenerProducto(id: $id) {
      nombre
      precio
      existencia
    }
  }
`;

const ACTUALIZAR_PRODUCTO = gql`
  mutation actualizarProducto($id: ID!, $input: ProductoInput) {
    actualizarProducto(id: $id, input: $input) {
      id
      nombre
      existencia
      precio
    }
  }
`;

const EditarProducto = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;

  // ? Consultar para obtener el producto
  const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
    variables: {
      id,
    },
  });

  // ? Mutation para modifcar el producto
  const [ actualizarProducto ] = useMutation(ACTUALIZAR_PRODUCTO);

  // ? Schema de validacion
  const schemaValidacion = Yup.object({
    nombre: Yup.string().required("* El nombre del producto es obligatorio"),
    existencia: Yup.number()
      .required("* Agrega la cantidad disponible")
      .positive("* No se aceptan numeros negativos")
      .integer("* La existencia debe ser numeros enteros"),
    precio: Yup.number()
      .required("* El precio es obligatorio")
      .positive("* No se aceptan nuevos negativos"),
  });

  // console.log(data)

  // * Prevenir que no cargue el componente sino hay resutados aún
  if (loading) return "Cargando...";

  if(!data) {
    return 'Accion no permitida';
  }

  const actualizarInforProducto = async(valores) => {

    const {nombre, existencia, precio} = valores;

    try {
      const { data } = await actualizarProducto({
        variables: {
          id,
          input: {
            nombre,
            precio,
            existencia
          }
        }
      })
      console.log(data);
      // ? Redirigir a productos
      router.push('/productos');

      // ? alerta
      Swal.fire(
        'Correcto',
        'El producto se actualizó correctamente',
        'success'
      )


    } catch (error) {
      console.log(error)
    }
  };

  const { obtenerProducto } = data;

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik
            enableReinitialize
            initialValues={obtenerProducto}
            validationSchema={schemaValidacion}
            onSubmit={(valores) => {
              actualizarInforProducto(valores);
            }}>
            {(props) => {
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
                      placeholder="Nombre Producto"
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
                      htmlFor="existencia">
                      Cantidad Disponible
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="existencia"
                      type="number"
                      placeholder="Cantidad Disponible"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.existencia}
                    />
                  </div>

                  {/* Mandar el error del formik */}
                  {props.touched.existencia && props.errors.existencia ? (
                    <p className="mb-4 border-l-4 border-grey-500 text-red-500 text-xs italic">
                      {props.errors.existencia}
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
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.precio}
                    />
                  </div>

                  {/* Mandar el error del formik */}
                  {props.touched.precio && props.errors.precio ? (
                    <p className="mb-4 border-l-4 border-grey-500 text-red-500 text-xs italic">
                      {props.errors.precio}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 font-bold cursor:pointer ..."
                    value="Iniciar">
                    Editar Producto
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

export default EditarProducto;
