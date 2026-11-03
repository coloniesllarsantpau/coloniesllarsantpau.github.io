// Textos i dades de contacte de la pàgina /contacte i del peu de totes les pàgines.
// Qualsevol dada pot faltar: la web només mostra les que hi són.
export interface ContactPhone {
  text: string;
  href: string;
}

export const contact: {
  title: string;
  subtitle: string;
  name?: string;
  email?: string;
  phones: ContactPhone[];
} = {
  title: 'Contacte',
  subtitle: 'Per reserves i més informació contacteu amb:',
  name: 'Albert Roca Comellas',
  email: 'info@coloniesllarsantpau.com',
  phones: [
    { text: '649 57 20 88', href: 'tel:+34649572088' },
    { text: '972 721 270', href: 'tel:+34972721270' },
  ],
};
