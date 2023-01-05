<template>
  <li class="cart__order">
    <h3>{{ item.product.title }}</h3>
    <b>{{ priceFormat }} ₽</b>
    <span>x {{ getCountProducts }}</span>
    <br/>
    <span>Артикул: {{ item.productId }}</span>
  </li>
</template>

<script>
import { defineComponent } from 'vue';
import getNoun from '@/helpers/getNoun';
import numberFormat from '@/helpers/numberFormat';
import { mapActions } from 'vuex';

export default defineComponent({
  props: ['item'],
  computed: {
    getCountProducts() {
      return getNoun(this.item.amount, 'товар', 'товара', 'товаров');
    },
    priceFormat() {
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
