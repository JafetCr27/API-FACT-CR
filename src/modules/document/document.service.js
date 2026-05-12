const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const {
  generarFacturaXML
} = require("../../services/xml.service");

const {
  generarConsecutivo,
  generarClave,
  obtenerCodigoDocumento
} = require("../../services/clave.service");

const {
  firmarXML
} = require("../../services/sign.service");
// =========================
// Crear documento
// =========================

async function createDocument(data, user) {

  let subtotal = 0;
  let tax = 0;
  let total = 0;

  // =========================
  // Procesar líneas
  // =========================

  const linesData = data.lines.map((line, index) => {

    const cantidad =
      Number(line.cantidad);

    const precioUnitario =
      Number(line.precioUnitario);

    const lineSubtotal =
      cantidad * precioUnitario;

    // =========================
    // Impuesto
    // =========================

    const taxRate =
      Number(line.taxRate || 0);

    const lineTax =
      lineSubtotal * (taxRate / 100);

    const lineTotal =
      lineSubtotal + lineTax;

    // =========================
    // Acumuladores
    // =========================

    subtotal += lineSubtotal;
    tax += lineTax;
    total += lineTotal;

    // =========================
    // Retorno línea
    // =========================

    return {

      lineNumber: index + 1,

      codeType:
        line.codeType || null,

      codigo:
        line.codigo || null,

      descripcion:
        line.descripcion,

      cantidad,

      unidadMedida:
        line.unidadMedida || "Unid",

      precioUnitario,

      subtotal:
        Number(lineSubtotal),

      taxCode:
        line.taxCode || null,

      taxRateCode:
        line.taxRateCode || null,

      taxRate,

      impuesto:
        Number(lineTax),

      totalLinea:
        Number(lineTotal)
    };
  });

  // =========================
  // Tipo documento Hacienda
  // =========================

  const tipoDocumento =
    obtenerCodigoDocumento(data.type);

  // =========================
  // Último documento
  // =========================

  const ultimoDocumento =
    await prisma.document.findFirst({

      where: {
        companyId: user.companyId,
        type: data.type
      },

      orderBy: {
        createdAt: "desc"
      }
    });

  // =========================
  // Número consecutivo
  // =========================

  let numero = 1;

  if (ultimoDocumento?.consecutivo) {

    const ultimoNumero =
      Number(
        ultimoDocumento.consecutivo.slice(-10)
      );

    numero = ultimoNumero + 1;
  }

  // =========================
  // Generar consecutivo
  // =========================

  const consecutivo =
    generarConsecutivo({

      sucursal: "001",

      terminal: "00001",

      tipoDocumento,

      numero
    });

  // =========================
  // Obtener company
  // =========================

  const company =
    await prisma.company.findUnique({

      where: {
        id: user.companyId
      }
    });

  // =========================
  // Generar clave Hacienda
  // =========================

  const clave =
    generarClave({
      company,
      consecutivo
    });

  // =========================
  // Crear documento
  // =========================

  const document =
    await prisma.document.create({

      data: {

        companyId:
          user.companyId,

        // =========================
        // Tipo documento
        // =========================

        type:
          data.type,

        clave,

        consecutivo,

        // =========================
        // Receptor
        // =========================

        receptorNombre:
          data.receptorNombre,

        receptorIdentificacion:
          data.receptorIdentificacion,

        receptorIdentificationType:
          data.receptorIdentificationType,

        receptorEmail:
          data.receptorEmail || null,

        // =========================
        // Venta
        // =========================

        saleCondition:
          data.saleCondition,

        paymentMethod:
          data.paymentMethod,

        // =========================
        // Moneda
        // =========================

        currency:
          data.currency || "CRC",

        exchangeRate:
          Number(data.exchangeRate || 1),

        // =========================
        // Totales
        // =========================

        subtotal:
          Number(subtotal),

        tax:
          Number(tax),

        total:
          Number(total),

        // =========================
        // Estado
        // =========================

        status: "draft",

        // =========================
        // Líneas
        // =========================

        lines: {
          create: linesData
        }
      },

      include: {

        lines: true,

        company: {

          select: {

            id: true,

            name: true,

            commercialName: true,

            identification: true,

            identificationType: true,

            activityCode: true,

            email: true,

            phone: true,

            phoneCountryCode: true,

            province: true,

            canton: true,

            district: true,

            otherSigns: true,

            environment: true
          }
        }
      }
    });

  // =========================
  // Generar XML
  // =========================

  const xml = generarFacturaXML(
    document,
    company
  );
  // =========================
  // Firmar XML
  // =========================

  const xmlSigned =
    await firmarXML(
      xml,
      company
    );

  // =========================
  // Guardar XML
  // =========================

  const updatedDocument =
    await prisma.document.update({

      where: {
        id: document.id
      },

      data: {

        xml,

        xmlSigned,

        status: "signed"
      },

      include: {

        lines: true,

        company: {

          select: {

            id: true,

            name: true,

            commercialName: true,

            identification: true,

            identificationType: true,

            activityCode: true,

            email: true,

            phone: true,

            phoneCountryCode: true,

            province: true,

            canton: true,

            district: true,

            otherSigns: true,

            environment: true
          }
        }
      }
    });

  // =========================
  // Retornar documento final
  // =========================

  return {
    ...updatedDocument,
    xml,
    xmlSigned
  };
}

// =========================
// Obtener documentos
// =========================

async function getDocuments(user) {

  return prisma.document.findMany({

    where: {
      companyId: user.companyId
    },

    include: {

      lines: true,

      company: {

        select: {

          id: true,

          name: true,

          commercialName: true,

          identification: true,

          identificationType: true,

          activityCode: true,

          email: true,

          phone: true,

          phoneCountryCode: true,

          province: true,

          canton: true,

          district: true,

          otherSigns: true,

          environment: true
        }
      }
    },

    orderBy: {
      createdAt: "desc"
    }
  });
}

module.exports = {
  createDocument,
  getDocuments
};