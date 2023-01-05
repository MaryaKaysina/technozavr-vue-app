<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">Каталог</h1>
      <span class="content__info">{{ subtitle }}</span>
    </div>

    <div class="content__catalog">
      <ProductFilter
        v-model:price-from="filterPriceFrom"
        v-model:price-to="filterPriceTo"
        v-model:categoryId="filterCategoryId"
        v-model:colorId="filterColorId"
      />

      <section class="catalog">
        <div v-if="productsLoading" class="loader-item">
          <div class="loader"></div>
        </div>

        <div v-if="productsLoadingFailed" class="loading-error">
          <span>Произошла ошибка при загрузке товаров...</span>
          <button @click.prevent="loadProducts" class="button button--primery">
            Попробовать еще раз
          </button>
        </div>

        <ProductList
          :products="products"
        />
        <BasePagination v-model="page" :count="countProducts" :per-page="productsPerPage" />
      </section>
    </div>
  </main>
</template>

<script>
import { defineComponent } from 'vue';
import axios from 'axios';
import API_BASE_URL from '@/config';
import getNoun from '@/helpers/getNoun';
import ProductList from '@/components/ProductList';
import BasePagination from '@/components/BasePagination';
import ProductFilter from '@/components/ProductFilter';

export default defineComponent({
  components: { ProductList, BasePagination, ProductFilter },
  data() {
    return {
      page: 1,
      productsPerPage: 6,

      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: -1,
      filterColorId: -1,

      productsData: null,
      productsLoading: false,
      productsLoadingFailed: false,
    };
  },
  computed: {
    products() {
      return this.productsData?.items.map((product) => ({
        ...product,
        img: product.image.file.url,
      })) || [];
    },
    countProducts() {
      return this.productsData?.pagination.total || 0;
    },
    subtitle() {
      return getNoun(this.productsData?.pagination.total || 0, 'товар', 'товара', 'товаров');
    },
  },
  methods: {
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        axios
          .get(`${API_BASE_URL}/api/products`, {
            params: {
              page: this.page,
              limit: this.productsPerPage,
              categoryId: this.filterCategoryId,
              colorId: this.filterColorId,
              minPrice: this.filterPriceFrom,
              maxPrice: this.filterPriceTo,
            },
          })
          // eslint-disable-next-line no-return-assign
          .then((response) => this.productsData = response.data)
          // eslint-disable-next-line no-return-assign
          .catch(() => this.productsLoadingFailed = true)
          // eslint-disable-next-line no-return-assign
          .finally(() => this.productsLoading = false);
      }, 500);
    },
  },
  watch: {
    page() {
      this.loadProducts();
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
    filterCategoryId() {
      this.loadProducts();
    },
    filterColorId() {
      this.loadProducts();
    },
  },
  created() {
    this.loadProducts();
  },
});
</script>
