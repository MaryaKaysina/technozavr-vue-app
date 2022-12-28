<template>
  <li class="cart__order">
    <h3>{{ item.product.title }}</h3>
    <b>{{ (item.amount * item.product.price) | numberFormat }} ₽</b>
    <span>x {{ getCountProducts }}</span>
    <br/>
    <span>Артикул: {{ item.productId }}</span>
  </li>
</template>

<script>
import getNoun from '@/helpers/getNoun';
import numberFormat from '@/helpers/numberFormat';
import { mapActions } from 'vuex';

export default {
  props: ['item'],
  filters: { numberFormat },
  computed: {
    getCountProducts() {
      return getNoun(this.item.amount, 'товар', 'товара', 'товаров');
    },
  },
  methods: {
    ...mapActions([
      'deleteCartProduct',
      'incrementCartProductAmount',
      'decrementCartProductAmount',
    ]),
  },
};
</script>
