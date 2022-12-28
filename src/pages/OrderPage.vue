<!-- eslint-disable max-len -->
<template>
    <main class="content container">
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
          Корзина
        </h1>
        <span class="content__info">
          3 товара
        </span>
      </div>

      <section class="cart">
        <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
          <div class="cart__field">
            <div class="cart__data">

              <BaseFormText
                title="ФИО"
                :error="formError.name"
                placeholder="Введите ваше полное имя"
                v-model="formData.name"
              />

              <BaseFormText
                title="Адрес доставки"
                :error="formError.address"
                placeholder="Введите ваш адрес"
                v-model="formData.address"
              />

              <BaseFormText
                title="Телефон"
                type="tel"
                :error="formError.phone"
                placeholder="Введите ваш телефон"
                v-model="formData.phone"
              />

              <BaseFormText
                title="Email"
                type="email"
                :error="formError.email"
                placeholder="Введите ваш Email"
                v-model="formData.email"
              />

              <BaseFormTextarea
                title="Комментарий к заказу"
                :error="formError.comment"
                placeholder="Ваши пожелания"
                v-model="formData.comment"
              />

            </div>

            <div class="cart__options">
              <h3 class="cart__title">Доставка</h3>
              <ul class="cart__options options">
                <li class="options__item">
                  <label class="options__label">
                    <input
                      class="options__radio sr-only"
                      type="radio"
                      name="delivery"
                      value="0"
                      checked
                    >
                    <span class="options__value">
                      Самовывоз <b>бесплатно</b>
                    </span>
                  </label>
                </li>
                <li class="options__item">
                  <label class="options__label">
                    <input class="options__radio sr-only" type="radio" name="delivery" value="500">
                    <span class="options__value">
                      Курьером <b>500 ₽</b>
                    </span>
                  </label>
                </li>
              </ul>

              <h3 class="cart__title">Оплата</h3>
              <ul class="cart__options options">
                <li class="options__item">
                  <label class="options__label">
                    <input class="options__radio sr-only" type="radio" name="pay" value="card">
                    <span class="options__value">
                      Картой при получении
                    </span>
                  </label>
                </li>
                <li class="options__item">
                  <label class="options__label">
                    <input class="options__radio sr-only" type="radio" name="pay" value="cash">
                    <span class="options__value">
                      Наличными при получении
                    </span>
                  </label>
                </li>
              </ul>
            </div>
          </div>

          <div class="cart__block">
            <ul class="cart__orders" v-if="products">
              <OrderItem v-for="item in products" :key="item.productId" :item="item"/>
            </ul>

            <div class="cart__total">
              <p>Доставка: <b>500 ₽</b></p>
              <p>Итого:
                <b>{{ getCountProducts }}</b> на сумму
                <b>{{ (totalPrice + 500) | numberFormat }} ₽</b>
              </p>
            </div>

            <button class="cart__button button button--primery" type="submit">
              <div v-if="cartSendLoading" class="cart__loader">
                <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 100">
                  <path fill="#fff" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                    <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 50 50" to="360 50 50" repeatCount="indefinite" />
                  </path>
                </svg>
              </div>
              <span v-else>Оформить заказ</span>
            </button>
          </div>
          <div class="cart__error form__error-block" v-if="formErrorMessage">
            <h4>Заявка не отправлена!</h4>
            <p>
              {{ formErrorMessage }}
            </p>
          </div>
        </form>
      </section>
    </main>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config';
import getNoun from '@/helpers/getNoun';
import numberFormat from '@/helpers/numberFormat';
import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';
import OrderItem from '@/components/OrderItem.vue';
import { mapGetters } from 'vuex';

export default {
  components: { BaseFormText, BaseFormTextarea, OrderItem },
  data() {
    return {
      formData: {},
      formError: {},
      formErrorMessage: '',
      cartSendLoading: false,
    };
  },
  filters: { numberFormat },
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
  },
  methods: {
    order() {
      this.formError = {};
      this.formErrorMessage = '';
      this.cartSendLoading = true;

      // eslint-disable-next-line no-promise-executor-return
      (new Promise((resolve) => setTimeout(resolve, 1000)))
        .then(() => axios
          .post(
            `${API_BASE_URL}/api/orders`,
            { ...this.formData },
            { params: { userAccessKey: this.$store.state.userAccessKey } },
          )
          .then((response) => {
            this.$store.commit('resetCart');
            this.$store.commit('updateOrderInfo', response.data);
            this.$router.push({ name: 'orderInfo', params: { id: response.data.id } });
          })
          .catch((error) => {
            this.formError = error.response.data.error.request || {};
            this.formErrorMessage = error.response.data.error.message || '';
          })
          // eslint-disable-next-line no-return-assign
          .finally(() => this.cartSendLoading = false));
    },
  },
};
</script>
