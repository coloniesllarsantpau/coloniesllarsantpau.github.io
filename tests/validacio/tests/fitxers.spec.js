const { test, expect } = require('@playwright/test');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const { CURRENT_DIR, REFERENCE_DIR } = require('./helpers');

// Compara la sortida amb la referència (carpetes muntades a docker-compose.yml).

// Fitxers generats pel build, que no es comparen.
const GENERATED = [/^_nuxt\//, /^sw\.js$/];

// Diferències acceptades, cadascuna amb el motiu. Una diferència que no consti aquí fa fallar la prova,
// i una entrada que ja no sigui una diferència, també.
const HTML_SHELL = 'HTML generat pel build: enllaça els actius de _nuxt/ i el text es compara a text.spec.js';
const NO_METADATA = 'sense les metadades EXIF/XMP (càmera, sèrie de l\'objectiu); els píxels són idèntics';
const ALLOWED_DIFFERENCES = {
  '200.html': HTML_SHELL,
  'index.html': HTML_SHELL,
  'lacasa/index.html': HTML_SHELL,
  'serveis/index.html': HTML_SHELL,
  'excursions/index.html': HTML_SHELL,
  'fotos/index.html': HTML_SHELL,
  'collaboradors/index.html': HTML_SHELL,
  'contacte/index.html': HTML_SHELL,
  'photos/Llar_Sant_Pau_Bany_Habitacio.webp': NO_METADATA,
  'photos/Llar_Sant_Pau_Bany_Habitacio_26.webp': NO_METADATA,
  'photos/Llar_Sant_Pau_Bany_Habitacio_Minusvalids.webp': NO_METADATA,
  'photos/Llar_Sant_Pau_Bany_Infermeria.webp': NO_METADATA,
  'photos/Llar_Sant_Pau_Banys_Noies.webp': NO_METADATA,
  'photos/Llar_Sant_Pau_Sala_Primer_Pis.webp': NO_METADATA,
  'photos/Llar_Sant_Pau_Sala_Segon_Pis.webp': NO_METADATA,
  'photos/map.png': NO_METADATA,
};

function listFiles(dir, prefix = '') {
  return fs.readdirSync(path.join(dir, prefix), { withFileTypes: true }).flatMap((entry) => {
    const relative = path.posix.join(prefix, entry.name);
    return entry.isDirectory() ? listFiles(dir, relative) : [relative];
  });
}

function publicFiles(dir) {
  return listFiles(dir).filter((file) => !GENERATED.some((pattern) => pattern.test(file)));
}

function hash(dir, file) {
  return crypto.createHash('sha256').update(fs.readFileSync(path.join(dir, file))).digest('hex');
}

test('els fitxers públics són iguals que els de la referència, llevat de les diferències justificades', () => {
  const current = publicFiles(CURRENT_DIR);
  const reference = publicFiles(REFERENCE_DIR);
  expect(reference.length, 'la referència té fitxers').toBeGreaterThan(0);

  const differences = [...new Set([...current, ...reference])].filter(
    (file) =>
      !current.includes(file) || !reference.includes(file) || hash(CURRENT_DIR, file) !== hash(REFERENCE_DIR, file),
  );

  expect(differences.sort()).toEqual(Object.keys(ALLOWED_DIFFERENCES).sort());
});

for (const file of ['CNAME', 'favicon.ico']) {
  test(`${file} és idèntic al de la referència`, () => {
    expect(hash(CURRENT_DIR, file)).toBe(hash(REFERENCE_DIR, file));
  });
}
