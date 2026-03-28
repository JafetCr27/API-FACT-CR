const { create } = require('xmlbuilder2');

function generarFacturaXML(data, company) {

  const now = new Date().toISOString();

  const xml = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('FacturaElectronica', {
      xmlns: 'https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.4/facturaElectronica'
    })

    // 🔑 Clave
    .ele('Clave').txt(data.clave).up()

    // 📅 Fecha
    .ele('FechaEmision').txt(now).up()

    // 🏢 Emisor
    .ele('Emisor')
      .ele('Nombre').txt(company.name).up()
      .ele('Identificacion')
        .ele('Tipo').txt('01').up()
        .ele('Numero').txt(company.identification).up()
      .up()
    .up()

    // 👤 Receptor
    .ele('Receptor')
      .ele('Nombre').txt(data.receptor.nombre).up()
      .ele('Identificacion')
        .ele('Tipo').txt('01').up()
        .ele('Numero').txt(data.receptor.cedula).up()
      .up()
    .up()

    // 💳 Condición de venta
    .ele('CondicionVenta').txt('01').up()

    // 💰 Medio de pago
    .ele('MedioPago').txt('01').up()

    // 📦 Detalle de servicio
    .ele('DetalleServicio')

      .ele('LineaDetalle')
        .ele('NumeroLinea').txt('1').up()
        .ele('Cantidad').txt('1').up()
        .ele('UnidadMedida').txt('Sp').up()
        .ele('Detalle').txt('Producto demo').up()
        .ele('PrecioUnitario').txt(data.total).up()
        .ele('MontoTotal').txt(data.total).up()
        .ele('SubTotal').txt(data.total).up()
        .ele('MontoTotalLinea').txt(data.total).up()
      .up()

    .up()

    // 📊 Resumen
    .ele('ResumenFactura')
      .ele('CodigoTipoMoneda')
        .ele('CodigoMoneda').txt('CRC').up()
        .ele('TipoCambio').txt('1.00').up()
      .up()

      .ele('TotalGravado').txt(data.total).up()
      .ele('TotalExento').txt('0.00').up()
      .ele('TotalVenta').txt(data.total).up()
      .ele('TotalDescuentos').txt('0.00').up()
      .ele('TotalVentaNeta').txt(data.total).up()
      .ele('TotalImpuesto').txt('0.00').up()
      .ele('TotalComprobante').txt(data.total).up()
    .up()

    .end({ prettyPrint: true });

  return xml;
}

module.exports = { generarFacturaXML };