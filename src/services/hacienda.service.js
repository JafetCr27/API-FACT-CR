const axios = require('axios');

async function getToken(company) {
  console.log("Simulando token...");
  
  // 🔥 por ahora fake (sandbox)
  return "token_fake_123";
}

async function enviarComprobante(xmlFirmado, clave, token) {
  console.log("Enviando a Hacienda...");

  return {
    status: "rechazado",
    clave
  };
}

module.exports = {
  getToken,
  enviarComprobante
};