const { SignedXml } = require('xml-crypto');

function firmarXML(xml, privateKey, cert) {
  const sig = new SignedXml();

  sig.addReference(
    "//*[local-name(.)='FacturaElectronica']",
    ["http://www.w3.org/2000/09/xmldsig#enveloped-signature"]
  );

  sig.signingKey = privateKey;

  sig.keyInfoProvider = {
    getKeyInfo() {
      return `<X509Data><X509Certificate>${
        cert.replace('-----BEGIN CERTIFICATE-----', '')
            .replace('-----END CERTIFICATE-----', '')
            .replace(/\r?\n|\r/g, '')
      }</X509Certificate></X509Data>`;
    }
  };

  sig.computeSignature(xml);

  return sig.getSignedXml();
}

module.exports = { firmarXML };