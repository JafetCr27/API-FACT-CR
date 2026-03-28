const fs = require('fs');
const forge = require('node-forge');

function extraerCertificados(p12Path, password) {
  const p12Buffer = fs.readFileSync(p12Path);

  const p12Asn1 = forge.asn1.fromDer(p12Buffer.toString('binary'));
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

  let key = null;
  let cert = null;

  p12.safeContents.forEach(safeContents => {
    safeContents.safeBags.forEach(safeBag => {

      // 🔐 Private Key
      if (safeBag.type === forge.pki.oids.pkcs8ShroudedKeyBag) {
        key = forge.pki.privateKeyToPem(safeBag.key);
      }

      // 📜 Certificate
      if (safeBag.type === forge.pki.oids.certBag) {
        cert = forge.pki.certificateToPem(safeBag.cert);
      }

    });
  });

  return { key, cert };
}

module.exports = { extraerCertificados };