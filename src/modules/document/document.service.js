const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { extraerCertificados } = require('../../utils/cert');
const { firmarXML } = require('../../services/sign.service');

async function createDocument(company, data) {
  // 1. Generar XML
  const xml = generarFacturaXML(data, company);
  // 2. Extraer certificado (.p12)
  const { extraerCertificados } = require('../../utils/cert');
  const { firmarXML } = require('../../services/sign.service');

  const { key, cert } = extraerCertificados(
    company.certPath,
    company.certPassword
  );
  // 3. Firmar XML
  const xmlFirmado = firmarXML(xml, key, cert);

  // 4. Obtener token Hacienda
  const token = await getToken(company);

  // 5. Enviar a Hacienda (AQUÍ está el cambio 🔥)
  const respuesta = await enviarComprobante(xmlFirmado, data.clave, token);
 
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