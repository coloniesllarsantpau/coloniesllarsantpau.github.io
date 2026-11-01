// Textos de la portada. Una part pot ser text llis o text ressaltat (<strong>, amb color secundari opcional).
export type TextPart = string | { strong: string; secondary?: boolean };

export const home = {
  title: 'Llar Sant Pau',
  intro: [
    'La casa de colònies LLar Sant Pau és una antiga rectoria que es troba situada a les afores del poble de ',
    { strong: 'Sant Pau de Segúries.' },
  ] as TextPart[],
  // Cada paràgraf és una llista de frases; cada frase, una llista de parts.
  reputation: [
    [
      ['La Casa de Colònies ', { strong: 'Llar Sant Pau' }, ' té una reputació contrastada en aquest sector. '],
      ['Durant molts anys ha acollit a escoles, casals i grups d’esplai, famílies… '],
      [
        'Oferim un tracte familiar i proper, així com una ',
        { strong: 'cuina casolana amb productes de proximitat', secondary: true },
        ' i tenint en compte totes les opcions alimentàries.',
      ],
    ],
    [
      [
        'Tot això envoltats d’un marc natural incomparable, on podreu gaudir de la natura i de la gran quantitat d’activitats que ofereix la comarca del Ripollès.',
      ],
    ],
  ] as TextPart[][][],
  whereWeAre: 'On som?',
  mapUrl:
    'https://www.google.com/maps/place/Casa+de+col%C3%B2nies+Llar+Sant+Pau/@42.2617445,2.3719776,15z/data=!4m9!3m8!1s0x12a549655a85b9c9:0xd212c5fa84cb4d3b!5m2!4m1!1i2!8m2!3d42.2617445!4d2.3719776!16s%2Fg%2F11b6hqf97h',
};
