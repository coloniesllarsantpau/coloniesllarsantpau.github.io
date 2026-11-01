// Textos i dades de la pàgina /collaboradors.
export interface Collaborator {
  title: string;
  description: string;
  phone?: string;
  mobile: string;
  email: string;
  website: string;
}

export const collaboratorsPage = {
  title: 'Col·laboradors',
  subtitle: 'La casa ofereix activitats a través d’empreses externes. Algunes d’elles són:',
};

export const collaborators: Collaborator[] = [
  {
    title: 'EDR Events',
    description:
      'EDR Events és una empresa dedicada al servei de l’oci cultural i l’entreteniment. Aporten un ampli ventall de solucions per cobrir tota classe d’esdeveniments.',
    phone: '972 73 04 21',
    mobile: '649 274 736',
    email: 'info@edrevents.cat',
    website: 'www.edrevents.cat',
  },
  {
    title: 'Alt ter',
    description:
      'El CEA Alt Ter és una associació dedicada a l’educació a través de la descoberta de l’entorn natural i del patrimoni històric i social, així com la seva recuperació, conservació i difusió',
    phone: '972 72 13 17',
    mobile: '686 113 344',
    email: 'info@alt-ter.org',
    website: 'www.alt-ter.org',
  },
  {
    title: 'GR Experience',
    description: 'Empresa creativa i dinàmica dedicada a la pràctica d’activitat física i esports d’aventura',
    mobile: '695820788',
    email: 'info@alt-ter.org',
    website: 'www.grexperience.org',
  },
];
