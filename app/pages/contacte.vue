<template>
  <section class="content-wrapper contact">
    <AppBar>{{ contact.title }}</AppBar>
    <SpText class="contact__subtitle font-medium" :importance="6" size="xs">{{ contact.subtitle }}</SpText>
    <div class="content main content--mq">
      <div class="contact__info">
        <SpText v-if="contact.name" class="font-medium" :importance="6" size="xs">{{ contact.name }}</SpText>
        <SpText v-if="contact.email" class="font-medium" :importance="6" size="xs">
          <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
        </SpText>
        <SpText v-if="contact.phones.length" class="font-medium">
          <template v-for="(phone, index) in contact.phones" :key="phone.href">
            <template v-if="index > 0"> / </template><a :href="phone.href">{{ phone.text }}</a>
          </template>
        </SpText>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { seoHead } from '~/data/seo';
import { contact } from '~/data/contact';

useHead(seoHead('/contacte'));
</script>

<style lang="scss" scoped>
.contact {
  color: white;

  &__subtitle {
    color: white;
    text-align: center;
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 3rem 20%;
    border: 5px solid white;
    border-radius: 200px;
  }
}
</style>
