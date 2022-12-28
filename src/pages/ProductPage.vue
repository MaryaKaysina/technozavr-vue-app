<template>
    <main class="content container" v-if="productLoading">
      <div class="loader-item">
        <div class="loader"></div>
      </div>
    </main>
    <main class="content container" v-else-if="!productData && productLoadingFailed">
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
import axios from 'axios';
import API_BASE_URL from '@/config';
import ProductDetail from '@/components/ProductDetail';

export default {
  components: { ProductDetail },
  data() {
    return {
      productData: null,
      productLoading: false,
      productLoadingFailed: false,
    };
  },
  computed: {
    product() {
      return {
        title: this.productData.title,
        category: this.productData.category,
        price: this.productData.price,
        colors: this.productData.colors,
        img: this.productData.image.file.url,
        id: this.productData.id,
      };
    },
  },
  methods: {
    loadProduct() {
      this.productLoading = true;
      this.productLoadingFailed = false;
      this.productData = null;
      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        axios
          .get(`${API_BASE_URL}/api/products/${this.$route.params.id}`)
          // eslint-disable-next-line no-return-assign
          .then((response) => this.productData = response.data)
          // eslint-disable-next-line no-return-assign
          .catch(() => this.productLoadingFailed = true)
          // eslint-disable-next-line no-return-assign
          .finally(() => this.productLoading = false);
      }, 500);
    },
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loadProduct();
      },
      immediate: true,
    },
  },
};
</script>
