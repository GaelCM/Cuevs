import type { Notes } from "@/types/test";



export const getNotas = async (): Promise<Notes[]> => {
    if (window.electronApi?.getNotes) {
      const res = await window.electronApi.getNotes();
      if (!res) {
        return []; // Retorna un array vacío si no hay notas
      }
      return res as Notes[]; // Asegúrate de que res es un array de Notes
    } else {
      console.warn("electronAPI no está disponible.");
      return []; // Retorna un array vacío si electronAPI no está disponible
    }
  };

  
