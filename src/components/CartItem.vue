<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img
        :src="item.product.img"
        width="120"
        height="120"
        :alt="item.product.title"
      >
    </div>
    <h3 class="product__title">
      {{ item.product.title }}
    </h3>
    <span class="product__code">
      Артикул: {{ item.productId }}
    </span>

    <div class="product__counter form__counter">
      <button
        type="button"
        aria-label="Убрать один товар"
        @click.prevent="decrementCartProductAmount(item.productId)"
      >
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <label></label>
      <input type="text" v-model.number="amount" name="count">

      <button
        type="button"
        aria-label="Добавить один товар"
        @click.prevent="incrementCartProductAmount(item.productId)"
      >
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price">
      {{ totalPriceFormat }} ₽
    </b>

    <button
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
      @click.prevent="deleteCartProduct(item.productId)"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';
import numberFormat from '@/helpers/numberFormat';

export default defineComponent({
  props: ['item'],
  computed: {
    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        this.$store.dispatch(
          'updateCartProductAmount',
          { productId: this.item.productId, amount: value },
        );
      },
    },
    totalPriceFormat() {
      return numberFormat(this.item.amount * this.item.product.price);
    },
  },
  methods: {
    ...mapActions([
      'deleteCartProduct',
      'incrementCartProductAmount',
      'decrementCartProductAmount',
    ]),
  },
});
</script>
