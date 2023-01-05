<template>
  <main class="content container" v-if="cartLoading">
    <div class="loader-item">
      <div class="loader"></div>
    </div>
  </main>
  <main
    class="content container"
    v-else-if="cartLoadingFailed"
  >
    <div class="loading-error">
      <span>Не удалось загрузить корзину...</span>
      <button @click.prevent="loadCart" class="button button--primery">
        Попробовать еще раз
      </button>
    </div>
  </main>
  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main' }">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Корзина
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info">
        {{ getCountProducts }}
      </span>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">

            <CartItem v-for="item in products" :key="item.productId" :item="item"/>

          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{ totalPriceFormat }} ₽</span>
          </p>

          <router-link :to="{ name: 'order' }" custom v-slot="{ navigate }">
            <button 
              class="cart__button button button--primery"
              @click="navigate" 
              @keypress.enter="navigate" 
              type="submit"
              :disabled="!totalPrice"
            >
              Оформить заказ
            </button>
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { defineComponent } from 'vue';
import getNoun from '@/helpers/getNoun';
import numberFormat from '@/helpers/numberFormat';
import { mapGetters, mapActions } from 'vuex';
import CartItem from '@/components/CartItem';

export default defineComponent({
  components: { CartItem },
  data() {
    return {
      productData: null,
    };
  },
  computed: {
    ...mapGetters({
      products: 'cartDetailProducts',
      totalPrice: 'cartTotalPrice',
      cartLoading: 'cartLoading',
      cartLoadingFailed: 'cartLoadingFailed',
    }),
    getCountProducts() {
      return getNoun(this.products.length, 'товар', 'товара', 'товаров');
    },
    totalPriceFormat() {
      return numberFormat(this.totalPrice);
    },
  },
  methods: {
    ...mapActions(['loadCart']),
  },
});
</script>
