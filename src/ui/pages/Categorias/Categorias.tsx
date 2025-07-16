import { getCategoriasLocal } from "@/api/categoriasLocal/categoriasLocal";
import type { Categorias } from "@/types/Productos";
import { useEffect, useState } from "react";
import NuevaCategoriaSection from "./components/NuevaCategoriaSection";
import { useNavigate } from "react-router";

export default function CategoriasPage() {
    const [categorias, setCategorias] = useState<Categorias[]>([]);
    const navigate = useNavigate();

    const obtenerCategorias = async () => {
        const res = await getCategoriasLocal();
        if (res) {
            setCategorias(res);
        } else {
            console.error("Error al obtener las categorías");
        }
    };

    useEffect(() => {
        obtenerCategorias();
    }, []);

    // Handlers para editar y eliminar (puedes implementar la lógica real)
    const handleEditar = (idCategoria: number) => {
        navigate(`/categorias/editCategoria?id=${idCategoria}`);
    };

    const handleEliminar = (idCategoria: number) => {
        // Implementa la lógica de eliminación aquí
        alert(`Eliminar categoría ${idCategoria}`);
    };

    return (
        <div className="px-4 py-5 bg-white flex flex-col min-h-screen">
            <section className="flex justify-center">
                <h1 className="text-red-500 text-3xl font-bold">Categorias</h1>
            </section>

            <NuevaCategoriaSection />

            <section className="flex flex-col items-center px-5 mt-12 w-full">
                <ul
                    id="categoriasList"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-6xl"
                >
                    {categorias.map((categoria) => (
                        <li key={categoria.idCategoria} className="flex justify-center">

                            <div
                                className="bg-gray-100 rounded-xl shadow-md p-6 w-56 h-48 flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105 hover:bg-red-100 cursor-pointer relative group"
                                onClick={() => navigate(`/categorias/editCategoria?id=${categoria.idCategoria}`)}
                            >
                                <figure className="flex flex-col items-center">
                                    <div
                                        id="categoImg"
                                        className="w-16 h-16 bg-red-400 rounded-full mb-4 flex items-center justify-center"
                                    >
                                
                                    </div>
                                    <figcaption className="text-lg font-semibold text-gray-700 text-center">
                                        {categoria.categoriaName}
                                    </figcaption>
                                </figure>
                                <div
                                    className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={e => e.stopPropagation()}
                                >

                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow"
                                        title="Editar"
                                        onClick={() => handleEditar(categoria.idCategoria)}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 01-1.263-1.263l1-4a4 4 0 01.828-1.414z" />
                                        </svg>
                                    </button>

                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow"
                                        title="Eliminar"
                                        onClick={() => handleEliminar(categoria.idCategoria)}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}