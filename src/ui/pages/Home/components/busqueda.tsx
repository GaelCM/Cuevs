

import type { Producto } from "@/types/Productos";
import React, { useImperativeHandle } from "react";
import { z } from "zod";
import DialogProducto from "./DialogProducto";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {getProductoForVenta } from "@/api/productosLocal/productosLocal";
import { useListaProductos } from "@/hooks/listaProductos";


const busquedaSchema = z.object({
    producto: z.string().min(2,{
        message: "El producto debe tener al menos 2 caracteres"
    })
})


export const Busqueda = React.forwardRef<{ focus: () => void }, {id?:number}>(({id}, ref) => {


  const [producto, setProducto] = React.useState<Producto | null>(null);
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      // Asegurarnos de que el input existe y está montado
      if (inputRef.current) {
        // Usar setTimeout para asegurar que el focus se aplique después del re-render
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    }
  }));

  const {addProduct}=useListaProductos();

    const {register, handleSubmit, reset, formState: { errors }} = useForm<z.infer<typeof busquedaSchema>>({
        resolver: zodResolver(busquedaSchema),
        defaultValues: {
          producto: "",
        },
    })

      // Nuevo useEffect para enfocar el input cuando se cierra el diálogo
    React.useEffect(() => {
      if (!open && inputRef.current) {
        inputRef.current.focus();
      }
    }, [open]);

      const buscarProducto=async(values: z.infer<typeof busquedaSchema>)=>{
        const res=await getProductoForVenta(values.producto)
        if(res){
            addProduct(res)
            setProducto(res)
            if(id){
              setOpen(true)
            }
            //setOpen(true)
            reset() // Resetea el formulario después de buscar
            if(inputRef.current) {
                inputRef.current.focus(); // Enfoca el input después de buscar
            }
        }else{
            setProducto(null)
            setOpen(true)
        }
      }


    return(
        <>
        <form onSubmit={handleSubmit(buscarProducto)} className="bg-white rounded flex items-center p-4 shadow-sm border border-gray-200 ">
           
            <button className="outline-none focus:outline-none">
              <svg className="w-5 text-gray-600 h-5 cursor-pointer" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
            <input type="text" autoFocus  className='w-full px-3 py-2 rounded-md focus:outline-none focus:border-blue-500 text-black' 
            placeholder="Ingrese el código del producto"  {...register('producto') } 
            ref={e => {
              register('producto').ref(e);
              inputRef.current = e;
            }}
             />
            {errors.producto && <p className="text-red-500 text-sm">{errors.producto.message}</p>}   
        </form>
        <DialogProducto isOpen={open} onOpenChange={setOpen} product={producto} idDeudor={id} busquedaRef={inputRef} ></DialogProducto>
        </>
    )
})