<template>
  <main class="main theme-llarsantpau" :class="containerClass.map((classItem) => 'theme-llarsantpau--' + classItem)">
    <MainNavigation v-slot="{ closeNavigation }">
      <MainNavigationItem v-for="item in navigationItems" :key="item.url" :item="item" @click="closeNavigation" />
    </MainNavigation>
    <section class="main-section">
      <slot />
      <footer class="footer">
        <section class="content links">
          <div class="links__item">
            <img class="footer-logo" src="/logo/logo-circle-text.png" />
          </div>
          <div class="links__item">
            <SpText class="font-titles">Info</SpText>
            <NuxtLink to="/fotos">
              <SpText class="font-sans">Galeria de fotos</SpText>
            </NuxtLink>
            <NuxtLink to="/lacasa">
              <SpText class="font-sans">Descripció de la casa</SpText>
            </NuxtLink>
          </div>
          <div class="links__item">
            <SpText class="font-titles">Legal</SpText>
            <NuxtLink :to="route.path">
              <SpText class="font-sans">Avís Legal</SpText>
            </NuxtLink>
            <NuxtLink :to="route.path">
              <SpText class="font-sans">Política de cookies</SpText>
            </NuxtLink>
          </div>
          <div class="links__item">
            <SpText class="font-titles">Contacte</SpText>
            <SpText class="font-sans"
              ><a href="tel:654021143">654021143</a> / <a href="tel:972 721 270">972 721 270</a></SpText
            >
            <SpText class="font-sans"
              ><a href="mailto: info@coloniesllarsantpau.com">info@coloniesllarsantpau.com</a></SpText
            >
          </div>
        </section>
        <section class="content copyright">
          <NuxtLink to="/">© 2021 LLAR SANT PAU</NuxtLink>
          <div class="social">
            <a href="https://www.instagram.com/llarsantpau"><i class="ph-3x ph-instagram-logo" /></a>
          </div>
        </section>
      </footer>
    </section>
  </main>
</template>

<script setup lang="ts">
const route = useRoute();

const navigationItems = [
  { name: 'La casa', url: '/lacasa', containerClass: 'blue' },
  { name: 'Serveis', url: '/serveis', containerClass: 'red' },
  { name: 'Excursions', url: '/excursions', containerClass: 'green' },
  { name: '', url: '/', imageUrl: '/logo/logo-inverted.svg', containerClass: 'homepage blue' },
  { name: 'Fotos', url: '/fotos', containerClass: 'yellow' },
  { name: 'Col·laboradors', url: '/collaboradors', containerClass: 'red' },
  { name: 'Contacte', url: '/contacte', containerClass: 'yellow' },
];

// A Pages les rutes acaben en barra (/lacasa/); els elements del menú no.
const containerClass = computed(() => {
  const path = route.path.length > 1 ? route.path.replace(/\/$/, '') : route.path;
  const navigationItem = navigationItems.find((item) => item.url === path);
  return navigationItem?.containerClass.split(' ') ?? [];
});
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .main-section {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
    min-height: 145vh;

    @include large-screen {
      padding-top: $main-navigation-height-desktop;
    }
  }

  .footer {
    display: flex;
    flex-direction: column;
    background-color: $brown-base;
    color: white;

    &-logo {
      max-width: 150px;
    }
  }

  .links {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;

    @include small-screen {
      align-items: center;
      flex-direction: column;
    }

    &__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      padding: 2rem 0;
      gap: 1rem;
    }
  }

  .copyright {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    border-top: 2px solid white;

    a:hover {
      color: var(--color-secondary);
    }
  }
}
</style>
