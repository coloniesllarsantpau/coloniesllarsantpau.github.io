<template>
  <section class="content-wrapper hiking">
    <app-bar>Excursions</app-bar>
    <div class="content main" :class="`content--${$mq}`">
      <section class="hiking__list">
        <sp-hike v-for="item in hikes" :key="item.title" :item="item"></sp-hike>
      </section>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component, { Action } from 'nuxt-class-component';
import { State, namespace } from 'vuex-class';

const Store = namespace('main');

@Component({})
export default class Trekking extends Vue {
  @Store.Action
  public dummyAction!: () => Promise<void>;

  async fetch() {
    await this.loadData();
  }

  async loadData() {
    await Promise.all([this.dummyAction()]);
  }

  get hikes() {
    return [
      {
        title: 'La Via Romana',
        description: `
          La Via Romana té l’inici del seu recorregut a 500 metres de la casa de colònies.
          Anomenada també Via Annia era un ramal de la Via Augusta. La via és ben fàcil
          de resseguir i en alguns trams es troba en perfecte estat de conservació.
          Els murs, guarda-rodes i tota la resta d’altres elements de la Via romana
          del Capsacosta posen de manifest l’extraordinari treball de construcció realitzat
          uns dos mil anys enrere.
        `,
        imageUrl: 'photos/VIA ROMANA.png',
      },
      {
        title: 'Ruta del Ferro i del Carbó',
        description: `
          Està catalogada com a via verda i el seu recorregut de 18 km uneix les poblacions
          de Ripoll, Sant Joan de les Abadesses i Sant Pau de Segúries. Es tracta d’una via en molt bon estat, totalment asfaltada,
          ideal per fer-la caminant, amb bicicleta, patins…

          Es tracta d’un antic traçat de ferrocarril anomenat així perquè antigament s’utilitzava
          per transportar el carbó que s’extreia de les mines veïnes d’Ogassa. La ruta passa a uns
          500 m de la casa de colònies.`,
        imageUrl: 'photos/ruta_del_ferro13.png',
      },
      {
        title: 'Vall de Camprodon',
        description: `
          Camprodon és el poble més important de la vall. Degut a la seva natura generosa,
          Camprodon té una tradició de molts anys dins el món excursionista i del turisme.
          El seu bell paisatge convida a fer llargues caminades i el seu clima d'abundants neus a l'hiver
          fa que sigui un lloc idoni per la pràctica d'esports de neu.`,
        imageUrl: 'photos/escapada-a-camprodon.png',
      },
      {
        title: 'Vallter 2000',
        description: `
          Es troba a 29km de la casa i tant a l’hivern com a l’estiu s’hi poden realitzar
          un munt d’actvitats. A l’hivern l’estació obre les seves portes a tots el amants de l’esqui
          amb unes pistes i una qualitat de neu immillorables.
          A l’estiu també ens acollirà com a punt de partida per a diverses excursions als pics més
          emblemàtics de la zona.
          Trekking, BTT, esquí…`,
        imageUrl: 'photos/vallter-2000-panoramica-ivan-sanz.png',
      },
      {
        title: 'Molló Parc - Parc d\'aventures',
        description: `
          Us proposem passar un dia amb  la família i/o amics envoltats d’animals en semi-llibertat
          en un paratge natural preciós. Una sortida diferent que segur que agradarà a petits i a grans.
          Veniu i passegeu  per la natura veient ossos, marmotes, linx, llops, daines… més de 30 espècies
          d’animals diferents propis del Pirineu Català en el seu entorn natural.
          També disposa d'un parc parc temàtic que ofereix una gran varietat d'activitats d'aventura al
          aire lliure per a tota la família.
        `,
        imageUrl: 'photos/c870x524.png',
      },
    ];
  }
}
</script>

<style lang="scss" scoped>
.hiking {
  &__list {
    display: flex;
    flex-direction: column;
    gap: 4rem;
  }
}
</style>
