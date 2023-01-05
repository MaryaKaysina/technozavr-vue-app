<template>
  <ul class="catalog__list">
    <ProductItem :products="products" />
  </ul>
</template>

<script>
import { defineComponent } from 'vue';
import ProductItem from './ProductItem';

export default defineComponent({
  props: ['products'],
  components: { ProductItem },
});
</script>
