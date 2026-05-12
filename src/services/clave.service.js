const crypto = require("crypto");

// ========================================
// Generar consecutivo Hacienda
// ========================================
//
// Formato:
// Sucursal (3)
// Terminal (5)
// Tipo documento (2)
// Numero (10)
//
// Ejemplo:
// 00100001010000000001
//
// ========================================

function generarConsecutivo({
  sucursal = "001",
  terminal = "00001",
  tipoDocumento = "01",
  numero = 1
}) {

  const numeroFormateado =
    String(numero).padStart(10, "0");

  return (
    sucursal +
    terminal +
    tipoDocumento +
    numeroFormateado
  );
}

// ========================================
// Obtener código documento Hacienda
// ========================================

function obtenerCodigoDocumento(type) {

  const tipos = {

    FE: "01", // Factura Electrónica

    ND: "02", // Nota Débito

    NC: "03", // Nota Crédito

    TE: "04"  // Tiquete Electrónico
  };

  return tipos[type] || "01";
}

// ========================================
// Generar código seguridad
// ========================================
//
// Hacienda utiliza 8 dígitos
//
// ========================================

function generarCodigoSeguridad() {

  return crypto
    .randomInt(10000000, 99999999)
    .toString();
}

// ========================================
// Generar clave Hacienda
// ========================================
//
// Formato:
//
// País (3)
// Fecha ddmmyy (6)
// Identificación (12)
// Consecutivo (20)
// Situación (1)
// Código seguridad (8)
//
// Total = 50 caracteres
//
// ========================================

function generarClave({
  company,
  consecutivo,
  situacion = "1"
}) {

  // ========================================
  // País
  // ========================================

  const pais = "506";

  // ========================================
  // Fecha
  // ========================================

  const now = new Date();

  const dia =
    String(now.getDate()).padStart(2, "0");

  const mes =
    String(now.getMonth() + 1).padStart(2, "0");

  const year =
    String(now.getFullYear()).slice(-2);

  const fecha =
    `${dia}${mes}${year}`;

  // ========================================
  // Identificación
  // ========================================

  const identificacion =
    String(company.identification)
      .padStart(12, "0");

  // ========================================
  // Código seguridad
  // ========================================

  const codigoSeguridad =
    generarCodigoSeguridad();

  // ========================================
  // Clave final
  // ========================================

  return (
    pais +
    fecha +
    identificacion +
    consecutivo +
    situacion +
    codigoSeguridad
  );
}

module.exports = {

  generarConsecutivo,

  generarClave,

  obtenerCodigoDocumento
};