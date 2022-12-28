<template>
  <li class="catalog__item">
    <router-link class="catalog__pic" :to="{ name: 'product', params: { id: product.id } }">
      <img :src="product.img" srcset="img/radio@2x.jpg 2x" :alt="product.title">
    </router-link>

    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price">
      {{ product.price | numberFormat }} ₽ ₽
    </span>

    <ul class="colors colors--black">
      <li
        class="colors__item"
        v-for="color in product.colors"
        :key="color.id"
      >
        <label class="colors__label">
          <input
            class="colors__radio sr-only"
            type="radio"
            :value="color.code"
            v-model="currentColor"
          >
          <span class="colors__value" :style="'background-color: ' + color.code + ';'">
          </span>
        </label>
      </li>
    </ul>
  </li>
</template>

<script>
import gotoPage from '@/helpers/gotoPage';
import numberFormat from '@/helpers/numberFormat';

export default {
  data() {
    return {
      currentColor: this.product.colors[0].code,
    };
  },
  props: ['product'],
  filters: {
    numberFormat,
  },
  methods: {
    gotoPage,
  },
};
</script>
