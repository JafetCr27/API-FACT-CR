const { create } = require("xmlbuilder2");

function generarFacturaXML(document, company) {

  const now = new Date().toISOString();

  const subtotal = Number(document.subtotal || 0);
  const tax = Number(document.tax || 0);
  const total = Number(document.total || 0);

  const root = create({
    version: "1.0",
    encoding: "UTF-8"
  })
    .ele("FacturaElectronica", {
      xmlns:
        "https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.4/facturaElectronica"
    });

  // =========================
  // Encabezado
  // =========================

  root
    .ele("Clave")
    .txt(document.clave)
    .up();

  root
    .ele("CodigoActividad")
    .txt(company.activityCode)
    .up();

  root
    .ele("NumeroConsecutivo")
    .txt(document.consecutivo)
    .up();

  root
    .ele("FechaEmision")
    .txt(now)
    .up();

  // =========================
  // Emisor
  // =========================

  const emisor = root.ele("Emisor");

  emisor
    .ele("Nombre")
    .txt(company.name)
    .up();

  emisor
    .ele("Identificacion")

      .ele("Tipo")
      .txt(company.identificationType)
      .up()

      .ele("Numero")
      .txt(company.identification)
      .up()

    .up();

  if (company.commercialName) {

    emisor
      .ele("NombreComercial")
      .txt(company.commercialName)
      .up();
  }

  emisor
    .ele("Ubicacion")

      .ele("Provincia")
      .txt(company.province)
      .up()

      .ele("Canton")
      .txt(company.canton)
      .up()

      .ele("Distrito")
      .txt(company.district)
      .up()

      .ele("OtrasSenas")
      .txt(company.otherSigns)
      .up()

    .up();

  emisor
    .ele("Telefono")

      .ele("CodigoPais")
      .txt(company.phoneCountryCode || "506")
      .up()

      .ele("NumTelefono")
      .txt(company.phone)
      .up()

    .up();

  emisor
    .ele("CorreoElectronico")
    .txt(company.email)
    .up();

  // =========================
  // Receptor
  // =========================

  const receptor = root.ele("Receptor");

  receptor
    .ele("Nombre")
    .txt(document.receptorNombre)
    .up();

  receptor
    .ele("Identificacion")

      .ele("Tipo")
      .txt(document.receptorIdentificationType)
      .up()

      .ele("Numero")
      .txt(document.receptorIdentificacion)
      .up()

    .up();

  if (document.receptorEmail) {

    receptor
      .ele("CorreoElectronico")
      .txt(document.receptorEmail)
      .up();
  }

  // =========================
  // Venta
  // =========================

  root
    .ele("CondicionVenta")
    .txt(document.saleCondition)
    .up();

  root
    .ele("MedioPago")
    .txt(document.paymentMethod)
    .up();

  // =========================
  // Detalle
  // =========================

  const detalleServicio = root.ele("DetalleServicio");

  document.lines.forEach((line) => {

    const lineaDetalle = detalleServicio.ele("LineaDetalle");

    lineaDetalle
      .ele("NumeroLinea")
      .txt(line.lineNumber)
      .up();

    if (line.codigo) {

      lineaDetalle
        .ele("Codigo")

          .ele("Tipo")
          .txt(line.codeType || "04")
          .up()

          .ele("Codigo")
          .txt(line.codigo)
          .up()

        .up();
    }

    lineaDetalle
      .ele("Cantidad")
      .txt(Number(line.cantidad).toFixed(2))
      .up();

    lineaDetalle
      .ele("UnidadMedida")
      .txt(line.unidadMedida)
      .up();

    lineaDetalle
      .ele("Detalle")
      .txt(line.descripcion)
      .up();

    lineaDetalle
      .ele("PrecioUnitario")
      .txt(Number(line.precioUnitario).toFixed(2))
      .up();

    lineaDetalle
      .ele("MontoTotal")
      .txt(Number(line.subtotal).toFixed(2))
      .up();

    lineaDetalle
      .ele("SubTotal")
      .txt(Number(line.subtotal).toFixed(2))
      .up();

    if (line.impuesto > 0) {

      lineaDetalle
        .ele("Impuesto")

          .ele("Codigo")
          .txt(line.taxCode || "01")
          .up()

          .ele("CodigoTarifa")
          .txt(line.taxRateCode || "08")
          .up()

          .ele("Tarifa")
          .txt(Number(line.taxRate || 13).toFixed(2))
          .up()

          .ele("Monto")
          .txt(Number(line.impuesto).toFixed(2))
          .up()

        .up();
    }

    lineaDetalle
      .ele("MontoTotalLinea")
      .txt(Number(line.totalLinea).toFixed(2))
      .up();
  });

  // =========================
  // Resumen
  // =========================

  const resumen = root.ele("ResumenFactura");

  resumen
    .ele("CodigoTipoMoneda")

      .ele("CodigoMoneda")
      .txt(document.currency)
      .up()

      .ele("TipoCambio")
      .txt(Number(document.exchangeRate || 1).toFixed(2))
      .up()

    .up();

  resumen
    .ele("TotalGravado")
    .txt(subtotal.toFixed(2))
    .up();

  resumen
    .ele("TotalExento")
    .txt("0.00")
    .up();

  resumen
    .ele("TotalVenta")
    .txt(subtotal.toFixed(2))
    .up();

  resumen
    .ele("TotalDescuentos")
    .txt("0.00")
    .up();

  resumen
    .ele("TotalVentaNeta")
    .txt(subtotal.toFixed(2))
    .up();

  resumen
    .ele("TotalImpuesto")
    .txt(tax.toFixed(2))
    .up();

  resumen
    .ele("TotalComprobante")
    .txt(total.toFixed(2))
    .up();

  return root.end({
    prettyPrint: true
  });
}

module.exports = {
  generarFacturaXML
};