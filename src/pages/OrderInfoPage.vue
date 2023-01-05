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
  <main class="content container" v-else-if="orderInfo">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main' }">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'cart' }">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Заказ оформлен <span>№ {{ orderInfo.id }}</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина.
            На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа.
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{ orderInfo.name }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{ orderInfo.address }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                {{ orderInfo.phone }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{ orderInfo.email }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                картой при получении
              </span>
            </li>
          </ul>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">

            <OrderItem v-for="item in products" :key="item.productId" :item="item"/>

          </ul>

          <div class="cart__total">
            <p>Доставка: <b>500 ₽</b></p>
            <p>Итого:
              <b>{{ getCountProducts }}</b> на сумму
              <b>{{ (orderInfo.totalPrice + 500)  }} ₽</b>
            </p>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { defineComponent } from 'vue';
import getNoun from '@/helpers/getNoun';
import { mapGetters } from 'vuex';
import OrderItem from '@/components/OrderItem.vue';

export default defineComponent({
  components: { OrderItem },
  computed: {
    ...mapGetters({
      orderInfo: 'cartOrderInfo',
      cartLoading: 'cartLoading',
      cartLoadingFailed: 'cartLoadingFailed',
    }),
    getCountProducts() {
      return getNoun(this.orderInfo.basket.items.length, 'товар', 'товара', 'товаров');
    },
    products() {
      return this.orderInfo.basket.items.map((item) => ({
        ...item,
        productId: item.id,
        amount: item.quantity,
      }));
    },
  },
  methods: {
    loadCartInfo() {
      if (this.$store.state.orderInfo
      && this.$store.state.orderInfo.id === this.$route.params.id) return;

      this.$store.dispatch('loadOrderInfo', this.$route.params.id);
    },
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loadCartInfo();
      },
      immediate: true,
    },
  },
});
</script>
