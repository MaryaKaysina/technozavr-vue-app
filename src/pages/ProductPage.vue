<template>
  <main class="content container" v-if="productStatus.isLoading">
    <div class="loader-item">
      <div class="loader"></div>
    </div>
  </main>
  <main class="content container" v-else-if="!product && productStatus.isFailed">
    <div class="loading-error">
      <span>Не удалось загрузить товар...</span>
      <button @click.prevent="loadProduct" class="button button--primery">
        Попробовать еще раз
      </button>
    </div>
  </main>
  <main class="content container" v-else>
    <ProductDetail
      :product="product"
    />
  </main>
</template>

<script>
import { defineComponent, watch } from 'vue';
import ProductDetail from '@/components/ProductDetail';
import { useRoute } from 'vue-router';
import useProduct from '@/hooks/useProduct';

export default defineComponent({
  components: { ProductDetail },

  setup() {
    const $route = useRoute();
    const { product, status: productStatus, fetchProduct } = useProduct();

    watch(() => $route.fullPath, () => {
      fetchProduct($route.params.id);
    }, { immediate: true });

    return {
      productStatus,
      product,
    }
  }
});
</script>
