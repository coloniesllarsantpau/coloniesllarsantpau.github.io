<template>
  <section class="content-wrapper photos">
    <AppBar>{{ photosPage.title }}</AppBar>
    <div class="content main content--mq">
      <div class="photos__grid">
        <div
          v-for="(item, index) in photos"
          :key="item.name"
          class="photos__grid-item"
          :class="item.name"
          :style="{ gridArea: item.name }"
        >
          <img class="photos__grid-item__image" :src="item.src" />
          <SpText class="font-sans" :importance="5" size="xxs">{{ index + 1 }}. {{ item.description }}</SpText>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { photos, photosPage } from '~/data/photos';
</script>

<style lang="scss" scoped>
.photos {
  &__grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    grid-template-areas:
      'piscina casa casa'
      'polivalent2 casa casa'
      'llits14 polivalent1 polivalentAnnexa'
      'llits14 banysNois banysNois2'
      'multiesports multiesports banysNoies'
      'multiesports multiesports banyInfermeria'
      'piscina2 bany1 bany2'
      'multiesports2 cuinaMasia cuinaMasia'
      'cuina cuina cuina'
      'cuina cuina cuina'
      'cuina cuina cuina'
      'exteriorEdificisAnnexs dutxes cuina2'
      'lavabos entorns entorns'
      'lavabos entorns entorns'
      'plantaBaixa tobogan minusvalids'
      'lliteres infermeria minusvalids'
      'llits28 llits28 llits28'
      'llits26 menjadorAnnex exteriorMenjadorAnnex'
      'placaEdificisAnnex placaEdificisAnnex cuinaMasia2'
      'placaEdificisAnnex placaEdificisAnnex menjadorAnnex2'
      'polivalentAnnexa2 polivalentAnnexa2 polivalentBaixa';

    // Després de les regles base: han de guanyar-les.
    @include small-screen {
      display: flex;
      flex-direction: column;
    }

    &-item {
      display: flex;
      flex-direction: column;
      color: white;
      gap: 0.5rem;
      text-transform: capitalize;

      &__image {
        object-fit: cover;
        height: 100%;
      }
    }
  }
}
</style>
