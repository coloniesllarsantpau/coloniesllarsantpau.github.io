<template>
  <section class="sp-collaborator">
    <SpText class="sp-collaborator__title font-medium" :importance="4" size="sm">{{ item.title }}</SpText>
    <div class="sp-collaborator__info">
      <SpText class="sp-collaborator__info-description font-medium" :importance="5">{{ item.description }}</SpText>
      <div class="sp-collaborator__info-contact">
        <SpText class="sp-collaborator__info-contact__field phone font-titles">{{ item.phone }}</SpText>
        <SpText class="sp-collaborator__info-contact__field mobile font-titles">{{ item.mobile }}</SpText>
        <SpText class="sp-collaborator__info-contact__field email font-titles">{{ item.email }}</SpText>
        <SpText class="sp-collaborator__info-contact__field website font-titles">{{ item.website }}</SpText>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Collaborator } from '~/data/collaborators';

defineProps<{ item: Collaborator }>();
</script>

<style lang="scss" scoped>
.sp-collaborator {
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

    &-contact {
      flex: none;
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      &__field {
        &.website {
          color: var(--color-secondary);
        }
      }
    }

    // Després de les regles base: han de guanyar-les (abans, .mobile afegia especificitat).
    @include small-screen {
      flex-direction: column;
      gap: 1rem;

      &-description {
        max-width: initial;
      }
    }
  }
}
</style>
