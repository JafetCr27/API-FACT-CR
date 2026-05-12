const fs = require("fs");

const forge = require("node-forge");

const { DOMParser } = require("xmldom");

const { SignedXml } = require("xml-crypto");

// ========================================
// Firmar XML Hacienda
// ========================================

async function firmarXML(xml, company) {

  try {

    // ========================================
    // Leer certificado .p12
    // ========================================

    const p12Buffer =
      fs.readFileSync(company.certPath);

    const p12Der =
      forge.util.createBuffer(
        p12Buffer.toString("binary")
      );

    const p12Asn1 =
      forge.asn1.fromDer(p12Der);

    const p12 =
      forge.pkcs12.pkcs12FromAsn1(
        p12Asn1,
        company.certPassword
      );

    // ========================================
    // Obtener llave privada
    // ========================================

    let privateKey = null;

    let certificate = null;

    for (const safeContents of p12.safeContents) {

      for (const safeBag of safeContents.safeBags) {

        // ========================================
        // Llave privada
        // ========================================

        if (
          safeBag.type ===
          forge.pki.oids.pkcs8ShroudedKeyBag
        ) {

          privateKey =
            forge.pki.privateKeyToPem(
              safeBag.key
            );
        }

        // ========================================
        // Certificado
        // ========================================

        if (
          safeBag.type ===
          forge.pki.oids.certBag
        ) {

          certificate =
            forge.pki.certificateToPem(
              safeBag.cert
            );
        }
      }
    }

    // ========================================
    // Validaciones
    // ========================================

    if (!privateKey) {

      throw new Error(
        "No se encontró llave privada en el certificado"
      );
    }

    if (!certificate) {

      throw new Error(
        "No se encontró certificado en el .p12"
      );
    }

    // ========================================
    // Parsear XML
    // ========================================

    const doc =
      new DOMParser().parseFromString(xml);

    // ========================================
    // Crear firma
    // ========================================

    const sig = new SignedXml();

    sig.signatureAlgorithm =
      "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
    
    sig.canonicalizationAlgorithm =
      "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";
    
    sig.privateKey = privateKey;

    sig.addReference({
      xpath:
        "//*[local-name(.)='FacturaElectronica']",

      transforms: [
        "http://www.w3.org/2000/09/xmldsig#enveloped-signature"
      ],

      digestAlgorithm:
        "http://www.w3.org/2001/04/xmlenc#sha256"
    });


    // ========================================
    // KeyInfo
    // ========================================

    sig.keyInfoProvider = {

      getKeyInfo() {

        return `
<KeyInfo>
  <X509Data>
    <X509Certificate>
      ${
        certificate
          .replace(
            "-----BEGIN CERTIFICATE-----",
            ""
          )
          .replace(
            "-----END CERTIFICATE-----",
            ""
          )
          .replace(/\r?\n|\r/g, "")
      }
    </X509Certificate>
  </X509Data>
</KeyInfo>
`;
      }
    };

    // ========================================
    // Generar firma
    // ========================================

    sig.computeSignature(xml);
    sig.canonicalizationAlgorithm =
      "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";
    const signedXml =
      sig.getSignedXml();

    // ========================================
    // Retornar XML firmado
    // ========================================

    return signedXml;

  } catch (error) {

    console.error(
      "Error firmando XML:",
      error
    );

    throw error;
  }
}

module.exports = {
  firmarXML
};