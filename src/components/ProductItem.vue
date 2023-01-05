<template>
  <li v-bind="$attrs" class="catalog__item" v-for="product in productsNormalized" :key="product.id">
    <router-link class="catalog__pic" :to="{ name: 'product', params: { id: product.id } }">
      <img :src="product.img" srcset="img/radio@2x.jpg 2x" :alt="product.title">
    </router-link>

    <h3 class="catalog__title">
      <a href="#" @click.prevent="openQuickView(product.id)">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price">
      {{ product.priceFormat  }} ₽
    </span>

    <ul class="colors colors--black">
      <li
        class="colors__item"
        v-for="color in product.colors"
        :key="color.id"
      >
        <label class="colors__label">
          <input
            :name="'colors' + product.id"
            class="colors__radio sr-only"
            type="radio"
            :value="color.code"
            v-model="product.currentColor"
          >
          <span class="colors__value" :style="'background-color: ' + color.code + ';'">
          </span>
        </label>
      </li>
    </ul>
  </li>
  <BaseModal v-model:open="isQuickViewOpen">
    <ProductQuickView :product-id="currentProductId" />
  </BaseModal>
</template>

<script>
import { defineComponent, defineAsyncComponent, h } from 'vue';
import numberFormat from '@/helpers/numberFormat';
import BaseModal from '@/components/BaseModal';

export default defineComponent({
  inheritAttrs: false,
  components: { 
    BaseModal,  
    ProductQuickView: defineAsyncComponent({
      loader: () => import('@/components/ProductQuickView'),
      delay: 0,
      loadingComponent: () => h('div', 'Загрузка...')
    })
  },
  data() {
    return {
      currentProductId: null,
    };
  },
  props: ['products'],
  methods: {
    openQuickView(productId) {
      this.currentProductId = productId;
    },
  },
  computed: {
    productsNormalized() {
      return this.products.map((product) => {
        return {
          ...product,
          priceFormat: numberFormat(product?.price),
          currentColor: product.colors[0].code,
        }
      })
    },
    isQuickViewOpen: {
      get() {
        return !!this.currentProductId;
      },
      set(isOpen) {
        if (!isOpen) {
          this.currentProductId = null;
        }
      }
    },
  },
});
</script>
