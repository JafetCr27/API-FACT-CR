const axios = require('axios');
const qs = require('qs');

async function getToken(company) {
  const url = "https://idp.comprobanteselectronicos.go.cr/auth/realms/rut/protocol/openid-connect/token";

  const data = qs.stringify({
    grant_type: "password",
    client_id: process.env.HACIENDA_CLIENT_ID || "api-stag",
    username: company.haciendaUser,
    password: company.haciendaPassword
  });

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    return response.data.access_token;

  } catch (error) {
    console.error("❌ Error obteniendo token:", error.response?.data || error.message);
    throw new Error("Error autenticando con Hacienda");
  }
}
async function enviarComprobante(xmlFirmado, clave, token, company) {
  const url = company.environment === "prod"
    ? "https://api.comprobanteselectronicos.go.cr/recepcion/v1/recepcion"
    : "https://api.comprobanteselectronicos.go.cr/recepcion-sandbox/v1/recepcion";

  const payload = {
    clave: clave,
    fecha: new Date().toISOString(),
    emisor: {
      tipoIdentificacion: "01",
      numeroIdentificacion: company.identification
    },
    comprobanteXml: Buffer.from(xmlFirmado).toString('base64')
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    return response.data;

  } catch (error) {
    console.error("❌ Error enviando comprobante:", error.response?.data || error.message);
    throw new Error("Error enviando comprobante a Hacienda");
  }
}

async function consultarEstado(clave, token, company) {
  const url = company.environment === "prod"
    ? `https://api.comprobanteselectronicos.go.cr/recepcion/v1/recepcion/${clave}`
    : `https://api.comprobanteselectronicos.go.cr/recepcion-sandbox/v1/recepcion/${clave}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;

  } catch (error) {
    console.error("❌ Error consultando estado:", error.response?.data || error.message);
    throw new Error("Error consultando estado en Hacienda");
  }
}