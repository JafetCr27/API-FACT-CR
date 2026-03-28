const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { generarFacturaXML } = require('../../services/xml.service');
const { extraerCertificados } = require('../../utils/cert');
const { firmarXML } = require('../../services/sign.service');

// 🔥 IMPORTS QUE TE FALTAN
const { getToken } = require('../../services/hacienda.service');
const { enviarComprobante } = require('../../services/hacienda.service');

const path = require('path');

async function createDocument(company, data) {

  // 1. Generar XML
  const xml = generarFacturaXML(data, company);

  // 2. Resolver ruta del certificado
  const certPath = path.resolve(company.certPath);

  // 3. Extraer certificado
  const { key, cert } = extraerCertificados(
    certPath,
    company.certPassword
  );

  
  // 4. Firmar XML
  const xmlFirmado = firmarXML(xml, key, cert);

  // 5. Obtener token Hacienda
  const token = await getToken(company);

  // 6. Enviar a Hacienda
  const respuesta = await enviarComprobante(xmlFirmado, data.clave, token);

  // 7. Guardar en DB
  return prisma.document.create({
    data: {
      companyId: company.id,
      type: data.type,
      clave: data.clave,
      status: 'sent',
      xml: xml,
      xmlFirmado: xmlFirmado,
      response: JSON.stringify(respuesta)
    }
  });
}

module.exports = { createDocument };