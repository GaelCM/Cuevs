
// Función helper para verificar si estamos en el cliente
const isClient = typeof window !== 'undefined';

export async function mandarReporteDashboardApi(){
     if (isClient && window.electronApi?.alertarUser) {
            const res = await window.electronApi.alertarUser();
            if (!res.success) {
              console.log("Error al enviar el reporte", res);
              return {success:false, message:res.message}
            }
            console.log("correo enviado correctamente:", res);
            return res as {success:boolean, message:string};
          } else {
            return null;
    }
}