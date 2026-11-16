<template>
  <section class="content-wrapper services">
    <AppBar>{{ servicesPage.title }}</AppBar>
    <SpText class="services__subtitle font-medium" :importance="6" size="xs">{{ servicesPage.subtitle }}</SpText>
    <div class="content main content--mq">
      <div class="services__grid">
        <div v-for="service in services" :key="service.title">
          <div class="services__grid-item">
            <div class="services__grid-item__icon">
              <img :src="service.icon" alt="" />
            </div>
            <SpText class="font-medium" :importance="6" size="xs">{{ service.title }}</SpText>
          </div>
        </div>
      </div>
      <img class="services-background" src="/services-background.svg" alt="" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { seoHead } from '~/data/seo';
import { services, servicesPage } from '~/data/services';

useHead(seoHead('/serveis'));
</script>

<style lang="scss" scoped>
.services {
  color: white;

  .main {
    display: flex;
    flex-direction: column;
    padding-bottom: 0;
    padding-top: 2rem;
    gap: 7rem;
  }

  &__subtitle {
    text-align: center;
  }

  &__grid {
    display: grid;
    gap: 3rem;
    row-gap: 3rem;
    grid-template-columns: repeat(3, 1fr);
    width: max-content;

    &-item {
      display: flex;
      gap: 1rem;

      &__icon {
        border: 1px solid white;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 30px;
          height: 30px;
        }
      }
    }
  }

  // Després de les regles base: han de guanyar-les (abans, .mobile afegia especificitat).
  @include small-screen {
    .main {
      padding-top: 6rem;
      align-items: center;
    }

    &__grid {
      row-gap: 1rem;
      grid-template-columns: initial;

      &-item {
        align-items: center;

        &__icon {
          width: 30px;
          height: 30px;

          img {
            width: 15px;
            height: 15px;
          }
        }
      }
    }
  }
}
</style>
