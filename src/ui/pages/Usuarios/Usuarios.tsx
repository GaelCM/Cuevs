
import { NuevoUsuarioSection } from "./componets/NuevoUsuario";
import TablaDeUsuarios from "./componets/TablaDeUsuarios";


export default function UsuariosPage(){
    return(
        <div className="px-15 py-5 bg-white flex flex-col">
            <div className="flex justify-center">
            <p className='text-3xl font-bold text-red-500 p-2'>
                Administre sus usuarios
            </p>
            </div>
            <NuevoUsuarioSection></NuevoUsuarioSection>
            <section className="pt-5 pb-5">
                <TablaDeUsuarios></TablaDeUsuarios>
                
            </section> 
        </div>
    )
}