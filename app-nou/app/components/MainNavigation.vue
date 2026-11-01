<template>
  <div>
    <div class="main-navigation">
      <i class="toggle-menu ph-xl ph-list" @click="toggleMenu()" />
      <section class="navigation-links font-medium" :class="{ expanded: isMenuOpen }">
        <i v-show="isMenuOpen" class="close-menu ph-3x ph-x" @click="closeMenu()" />
        <slot :close-navigation="closeMenu" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<style lang="scss" scoped>
.main-navigation {
  position: absolute;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 10rem;
  z-index: 2;

  .toggle-menu {
    padding: 20px;
    cursor: pointer;
  }

  .close-menu {
    position: absolute;
    z-index: 1;
    top: 20px;
    right: 20px;
    align-self: flex-end;
  }

  .navigation-links {
    display: flex;
    align-content: center;
    gap: 3rem;
    height: 70px;
  }

  // Després de les regles base: han de guanyar-les (abans, .mobile afegia especificitat).
  @include small-screen {
    position: relative;
    height: 4rem;
    background: black;
    color: white;
    justify-content: start;

    .navigation-links {
      width: 100%;
      flex-direction: column;
      height: auto;
      gap: 0;
      overflow: hidden;
      position: fixed;
      top: 0;
      height: 100vh;
      transition: right 0.5s;
      background: black;
      justify-content: center;
      right: 100%;

      &.expanded {
        right: 0;
      }
    }
  }

  // El botó del menú i el de tancar només es veuen en pantalla petita.
  @include large-screen {
    .toggle-menu,
    .close-menu {
      display: none;
    }
  }
}
</style>
