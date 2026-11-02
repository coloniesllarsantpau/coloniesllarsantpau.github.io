<template>
  <section class="sp-hike">
    <SpText class="sp-hike__title font-medium" :importance="4" size="md">{{ item.title }}</SpText>
    <div class="sp-hike__info">
      <SpText class="sp-hike__info-description font-medium" :importance="5">{{ item.description }}</SpText>
      <div class="sp-hike__info-image">
        <img :alt="item.title" :src="item.imageUrl" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Hike } from '~/data/hikes';

defineProps<{ item: Hike }>();
</script>

<style lang="scss" scoped>
.sp-hike {
  display: flex;
  flex-direction: column;
  color: white;
  gap: 2rem;

  &__info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 10vw;

    &-description {
      flex: 1;
      max-width: 40vw;
    }

    &-image {
      flex: none;
      display: flex;
      flex-direction: column;
    }

    // Després de les regles base: han de guanyar-les (abans, .mobile afegia especificitat).
    @include small-screen {
      flex-direction: column;
      gap: 5rem;

      &-description {
        max-width: initial;
      }
    }
  }
}
</style>
