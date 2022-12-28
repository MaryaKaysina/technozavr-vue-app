<!-- eslint-disable max-len -->
<template>
  <router-link
    class="header__cart"
    aria-label="Корзина с товарами"
    :to="{ name: 'cart' }"
  >
    <div v-if="cartLoading">
      <span class="header__count header__count--loader">
        <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 100">
          <path fill="#9eff00" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
            <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 50 50" to="360 50 50" repeatCount="indefinite" />
          </path>
        </svg>
      </span>
    </div>
    <div v-else>
      <svg width="30" height="21" fill="currentColor">
        <use xlink:href="#icon-cart"></use>
      </svg>
      <span
        class="header__count"
        aria-label="Количество товаров"
        v-if="products.length > 0"
      >
        {{ products.length }}
      </span>
    </div>
  </router-link>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      products: 'cartDetailProducts',
      cartLoading: 'cartLoading',
      cartLoadingFailed: 'cartLoadingFailed',
    }),
  },
};
</script>
