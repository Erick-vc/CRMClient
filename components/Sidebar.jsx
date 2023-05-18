import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

function Sidebar() {
  // routing de next
  const router = useRouter();

  return (
    <aside className="bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5">
      <div>
        <p className="text-white text-2xl font-black pb-10">CRM Cliente</p>
      </div>
      <nav className="nav list-none ">
        <li
          className={router.pathname === "/inicio" ? "bg-blue-800 p-2" : "p-2"}>
          <Link href="/inicio">
            <div className="text-white block">Clientes</div>
          </Link>
        </li>

        <li
          className={
            router.pathname === "/pedidos" ? "bg-blue-800 p-2" : "p-2"
          }>
          <Link href="/pedidos">
            <div className="text-white  block">Pedidos</div>
          </Link>
        </li>

        <li
          className={
            router.pathname === "/productos" ? "bg-blue-800 p-2" : "p-2"
          }>
          <Link href="/productos">
            <div className="text-white  block">Productos</div>
          </Link>
        </li>
      </nav>

      <div className="sm:mt-10">
        <p className="text-white text-2xl font-black">Otras Opciones</p>
      </div>
      <nav className="mt-5 list-none">
        <li
          className={
            router.pathname === "/mejoresVendedores" ? "bg-blue-800 p-2" : "p-2"
          }>
          <Link href="/mejoresVendedores">
            <div className="text-white block">Mejores Vendedores</div>
          </Link>
        </li>
        <li
          className={
            router.pathname === "/mejoresClientes" ? "bg-blue-800 p-2" : "p-2"
          }>
          <Link href="/mejoresClientes">
            <div className="text-white block">Mejores Clientes</div>
          </Link>
        </li>
      </nav>
    </aside>
  );
}

export default Sidebar;
