import React, {useContext} from 'react';
import PedidoContext from "../../context/pedidos/PedidoContex";

const Total = () => {

  // ? Context de productos
  const pedidoContext = useContext(PedidoContext);
  const {total} = pedidoContext;

  return (
    <div className='flex items-center mt-5 justify-between bg-gray-300 p-3'>
      <h2 className='text-gray-800 text-lg'>Total a pagar</h2>
      <p className='text-gray-800 mt-0'>$ {total}</p>
    </div>
  );
}

export default Total;
