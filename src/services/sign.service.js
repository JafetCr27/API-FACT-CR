const { SignedXml } = require('xml-crypto');

function firmarXML(xml, privateKey, cert) {

  const sig = new SignedXml({
    canonicalizationAlgorithm: "http://www.w3.org/2001/10/xml-exc-c14n#",
    signatureAlgorithm: "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"
  });

  sig.addReference({
    xpath: "//*[local-name(.)='FacturaElectronica']",
    transforms: [
      "http://www.w3.org/2000/09/xmldsig#enveloped-signature"
    ],
    digestAlgorithm: "http://www.w3.org/2001/04/xmlenc#sha256"
  });

  // 🔥 ESTE ES EL CAMBIO CLAVE
  sig.privateKey = privateKey;

  sig.keyInfoProvider = {
    getKeyInfo() {
      return `<X509Data><X509Certificate>${
        cert
          .replace('-----BEGIN CERTIFICATE-----', '')
          .replace('-----END CERTIFICATE-----', '')
          .replace(/\r?\n|\r/g, '')
      }</X509Certificate></X509Data>`;
    }
  };

  sig.computeSignature(xml);

  return sig.getSignedXml();
}

module.exports = { firmarXML };