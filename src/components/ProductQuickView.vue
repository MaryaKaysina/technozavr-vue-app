<template>
  <div v-if="productStatus.isLoading">
    <div class="loader-item">
      <div class="loader"></div>
    </div>
  </div>
  <div v-else-if="!product && productStatus.isFailed">
    <div class="loading-error">
      <span>Не удалось загрузить товар...</span>
      <button @click.prevent="loadProduct" class="button button--primery">
        Попробовать еще раз
      </button>
    </div>
  </div>
  <div v-else>
    <ProductDetailQuick
      :product="product"
    />
  </div>
</template>

<script>
import { defineComponent, watch } from 'vue';
import ProductDetailQuick from '@/components/ProductDetailQuick';
import { useRoute } from 'vue-router';
import useProduct from '@/hooks/useProduct';

export default defineComponent({
  props: {
    productId: { type: [Number, String], required: true },
  },
  components: { ProductDetailQuick },

  setup(props) {
    const $route = useRoute();
    const { product, status: productStatus, fetchProduct } = useProduct();

    watch(() => $route.fullPath, () => {
      fetchProduct(props.productId);
    }, { immediate: true });

    return {
      productStatus,
      product,
    }
  }
});
</script>

