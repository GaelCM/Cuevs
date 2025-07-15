import { useSearchParams } from "react-router";
import { ProductoDetalle } from "./components/ProductoDetalle";


export function ProductoDetailPage(){
    const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return (
      <div className="bg-white pt-10 flex flex-col items-center justify-center">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>ID de producto no especificado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white pt-10 flex flex-col items-center justify-center">
      <section className="px-10">
        <ProductoDetalle id={id} />
      </section>
    </div>
  );
}