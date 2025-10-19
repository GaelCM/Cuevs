import { ipcMain } from "electron";
import db from '../db.js';


function registerReportesGeneral(){
    ipcMain.handle('get-reporteVentasPorMes', (event, fechaDesde, fechaHasta ) => {
  const query = `
    SELECT
        strftime('%Y-%m', v.fechaVenta) AS mes,
        COUNT(v.idVenta) AS totalVentas,
        SUM(v.totalVenta) AS montoTotal,
        SUM(CASE WHEN v.tipoPago = 0 THEN v.totalVenta ELSE 0 END) AS ventasEfectivo,
        SUM(CASE WHEN v.tipoPago = 1 THEN v.totalVenta ELSE 0 END) AS ventasTarjeta,
        AVG(v.totalVenta) AS promedioVenta
      FROM
        ventas v
      WHERE
        strftime('%Y-%m', v.fechaVenta) BETWEEN ? AND ?
        AND v.idStatusVenta = 1
      GROUP BY
        strftime('%Y-%m', v.fechaVenta)
      ORDER BY
        mes ASC;
  `;
  const stmt = db.prepare(query);
  const res = stmt.all(fechaDesde.slice(0,7), fechaHasta.slice(0,7));

  return res.map(r=>(
    {
    mes:r?.mes || "nah",
    totalVentas: r?.totalVentas || 0,
    montoTotal: r?.montoTotal || 0,
    ventasEfectivo: r?.ventasEfectivo || 0,
    ventasTarjeta: r?.ventasTarjeta || 0,
    promedioVenta: r?.promedioVenta || 0
    }
  ));
});
}


ipcMain.handle('get-listaVentasPorMes', (event, fechaDesde, fechaHasta ) => {
  try {
    const query = `
      SELECT
        date(v.fechaVenta) AS fecha,
        COUNT(v.idVenta) AS cantidadVentas,
        SUM(v.totalVenta) AS totalDia,
        SUM(CASE WHEN v.tipoPago = 0 THEN v.totalVenta ELSE 0 END) AS efectivo,
        SUM(CASE WHEN v.tipoPago = 1 THEN v.totalVenta ELSE 0 END) AS tarjeta
      FROM
        ventas v
      WHERE
        strftime('%Y-%m', v.fechaVenta) BETWEEN ? AND ?
        AND v.idStatusVenta = 1
      GROUP BY
        date(v.fechaVenta)
      ORDER BY
        fecha ASC;
    `;

    const stmt = db.prepare(query);
    const res = stmt.all(fechaDesde.slice(0,7), fechaHasta.slice(0,7));

    return res.map(r => ({
      fecha: r.fecha,
      cantidadVentas: r.cantidadVentas || 0,
      totalDia: r.totalDia || 0,
      efectivo: r.efectivo || 0,
      tarjeta: r.tarjeta || 0
    }));
  } catch (error) {
    console.error("Error en get-lista-ventas-por-mes:", error);
    return [];
  }
});

export {registerReportesGeneral};