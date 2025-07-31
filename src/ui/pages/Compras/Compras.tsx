

export default function ComprasPage(){
    
    return(
        <div className="flex flex-col items-center bg-white ">
            <section className="py-10 text-center">
                <h1 className="text-3xl font-bold text-red-500 mb-6">Mis Compras</h1> 
            </section>
            <section>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-2xl">Proximamente...</p>
                </div>
            </section>
        </div>
    )
}