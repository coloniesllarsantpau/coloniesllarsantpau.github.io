<template>
  <section class="content-wrapper homepage">
    <!-- Abans, un carrusel (hooper) amb una sola diapositiva: n'hi ha prou amb la diapositiva fixa. -->
    <div class="slider">
      <div class="slide">
        <SpText class="slide__title font-titles fade-in-text" :importance="1" size="xxl">{{ home.title }}</SpText>
        <img
          class="fade-in-image"
          src="/photos/Llar_Sant_Pau_Exterior_Masia.webp"
          alt="Façana de pedra de la masia de la casa de colònies Llar Sant Pau, amb el campanar al darrere"
        />
      </div>
    </div>
    <div class="content content--mq">
      <section class="homepage__lacasa">
        <SpTextArticle class="homepage__lacasa-first" highlight="right">
          <template #left>
            <p class="homepage__lacasa-first__text">
              <HomeTextParts :parts="home.intro" />
            </p>
          </template>
          <template #right>
            <img
              src="/photos/Llar_Sant_Pau_Menjador.webp"
              alt="Menjador annex amb una taula llarga de fusta i l'altell"
            />
          </template>
        </SpTextArticle>
        <SpTextArticle :gap="false" highlight="left">
          <template #left>
            <img src="/photos/Llar_Sant_Pau_Piscina.webp" alt="Piscina envoltada de gespa, amb el bosc al fons" />
          </template>
          <template #right>
            <div class="small-houses__wrapper">
              <div class="small-hosues">
                <img v-for="index in 10" :key="index" src="/logo/logo-without-circle.svg" alt="" />
              </div>
            </div>
          </template>
        </SpTextArticle>
        <SpTextArticle class="homepage__lacasa-last" highlight="right">
          <template #left>
            <div class="homepage__lacasa-last__text">
              <p v-for="(paragraph, index) in home.reputation" :key="index">
                <span v-for="(sentence, sentenceIndex) in paragraph" :key="sentenceIndex">
                  <HomeTextParts :parts="sentence" />
                </span>
              </p>
            </div>
          </template>
          <template #right>
            <img src="/photos/Llar_Sant_Pau_Entorns.webp" alt="Prat i muntanyes dels entorns de la casa" />
          </template>
        </SpTextArticle>
        <h2 class="on-som">{{ home.whereWeAre }}</h2>
      </section>
    </div>
    <a :href="home.mapUrl" target="_blank">
      <img
        src="/photos/map.png"
        alt="Mapa amb la ubicació de la casa de colònies Llar Sant Pau a Sant Pau de Segúries"
      />
    </a>
  </section>
</template>

<script setup lang="ts">
import { seoHead } from '~/data/seo';
import { home } from '~/data/home';

useHead(seoHead('/'));
</script>

<style lang="scss" scoped>
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.fade-in-image {
  animation: fadeIn 0.3s;
}
.fade-in-text {
  animation: fadeIn 0.6s;
}

.homepage {
  display: flex;
  flex-direction: column;
  background: var(--color-primary);
  color: white;
  margin-top: calc(($main-navigation-height-desktop + 1px) * -1);

  @include small-screen {
    margin-top: initial;
  }

  &__lacasa {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    h2 {
      margin-top: 4rem;
    }

    &-last {
      &__text {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }
    }

    .small-houses__wrapper {
      position: relative;
      flex: 1;
    }

    .small-hosues {
      display: none;
      flex-direction: row;
      align-items: flex-end;
      gap: 1rem;

      img {
        max-width: 60px;
        align-self: flex-end;
      }
    }
  }

  // Abans, el selector .desktop (pantalla ampla).
  @include large-screen {
    .homepage__lacasa {
      margin-bottom: -2rem;
    }

    .homepage__lacasa-first {
      margin-bottom: -5rem;
      z-index: 1;

      &__text {
        padding-bottom: 6rem;
      }
    }

    .homepage__lacasa-last {
      margin-top: 3rem;
    }

    .small-hosues {
      display: flex;
      position: absolute;
      bottom: 0;
      left: 1rem;
    }
  }
}

// Mides del carrusel d'abans (hooper): contenidor amb la diapositiva a tota l'amplada.
.slider {
  position: relative;
  width: 100%;
  height: 1500px;
  max-height: 66vw;

  .slide {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 1500px;
    max-height: 66vw;
    overflow: hidden;

    &__title {
      color: white;
      position: absolute;
      width: 100%;
      display: flex;
      justify-content: center;
      z-index: 1;

      @include large-screen {
        margin-top: 160px;
      }
    }
  }
}
</style>
