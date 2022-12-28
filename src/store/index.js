import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import API_BASE_URL from '@/config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartProducts: [],
    userAccessKey: null,
    cartProductsData: [],
    cartLoading: false,
    cartLoadingFailed: false,
    orderInfo: null,
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    updateCartProductAmount(state, { productId, amount }) {
      const item = state.cartProducts.find((product) => product.productId === productId);

      if (item) {
        item.amount = amount;
      }
    },
    incrementCartProductAmount(state, productId) {
      const item = state.cartProducts.find((product) => product.productId === productId);

      if (item) {
        item.amount += 1;
      }
    },
    decrementCartProductAmount(state, productId) {
      const item = state.cartProducts.find((product) => product.productId === productId);

      if (item && item.amount > 1) {
        item.amount -= 1;
      }
    },
    deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter((item) => item.productId !== productId);
    },
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map((item) => ({
        productId: item.product.id,
        amount: item.quantity,
      }));
    },
    updateCartLoading(state, status) {
      state.cartLoading = status;
    },
    updateCartLoadingFailed(state, status) {
      state.cartLoadingFailed = status;
    },
  },
  getters: {
    cartDetailProducts(state) {
      // eslint-disable-next-line arrow-body-style
      return state.cartProducts.map((item) => {
        const { product } = state.cartProductsData
          .find((p) => p.product.id === item.productId);

        return {
          ...item,
          product: {
            ...product,
            img: product.image.file.url,
          },
        };
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts
        .reduce((acc, item) => (item.product.price * item.amount) + acc, 0);
    },
    cartLoading(state) {
      return state.cartLoading;
    },
    cartLoadingFailed(state) {
      return state.cartLoadingFailed;
    },
    cartOrderInfo(state) {
      return state.orderInfo;
    },
  },
  actions: {
    loadOrderInfo(context, orderId) {
      context.commit('updateCartLoading', true);
      context.commit('updateCartLoadingFailed', false);
      // eslint-disable-next-line no-promise-executor-return
      return (new Promise((resolve) => setTimeout(resolve, 1000)))
        .then(() => axios
          .get(`${API_BASE_URL}/api/orders/${orderId}`, {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          })
          .then((response) => {
            context.commit('updateOrderInfo', response.data);
          })
          // eslint-disable-next-line no-return-assign
          .catch(() => context.commit('updateCartLoadingFailed', true))
          // eslint-disable-next-line no-return-assign
          .finally(() => context.commit('updateCartLoading', false)));
    },
    loadCart(context) {
      context.commit('updateCartLoading', true);
      context.commit('updateCartLoadingFailed', false);
      // eslint-disable-next-line no-promise-executor-return
      return (new Promise((resolve) => setTimeout(resolve, 1000)))
        .then(() => axios
          .get(`${API_BASE_URL}/api/baskets`, {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          })
          .then((response) => {
            if (!context.state.userAccessKey) {
              localStorage.setItem('userAccessKey', response.data.user.accessKey);
              context.commit('updateUserAccessKey', response.data.user.accessKey);
            }
            context.commit('updateCartProductsData', response.data.items);
            context.commit('syncCartProducts');
          })
        // eslint-disable-next-line no-return-assign
          .catch(() => context.commit('updateCartLoadingFailed', true))
        // eslint-disable-next-line no-return-assign
          .finally(() => context.commit('updateCartLoading', false)));
    },
    addProductToCart(context, { productId, amount }) {
      // eslint-disable-next-line no-promise-executor-return
      return (new Promise((resolve) => setTimeout(resolve, 1000)))
        .then(() => axios
          .post(`${API_BASE_URL}/api/baskets/products`, {
            productId,
            quantity: amount,
          }, {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          })
          .then((response) => {
            context.commit('updateCartProductsData', response.data.items);
            context.commit('syncCartProducts');
          }));
    },
    updateCartProductAmount(context, { productId, amount }) {
      context.commit('updateCartProductAmount', { productId, amount });
      if (amount < 1) return null;

      return axios
        .put(`${API_BASE_URL}/api/baskets/products`, {
          productId,
          quantity: amount,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
        })
        .catch(() => context.commit('syncCartProducts'));
    },
    incrementCartProductAmount(context, productId) {
      context.commit('incrementCartProductAmount', productId);
      const item = context.state.cartProducts
        .find((product) => product.productId === productId);

      return axios
        .put(`${API_BASE_URL}/api/baskets/products`, {
          productId,
          quantity: item.amount,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
        })
        .catch(() => context.commit('syncCartProducts'));
    },
    decrementCartProductAmount(context, productId) {
      context.commit('decrementCartProductAmount', productId);
      const item = context.state.cartProducts
        .find((product) => product.productId === productId);

      return axios
        .put(`${API_BASE_URL}/api/baskets/products`, {
          productId,
          quantity: item.amount,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
        })
        .catch(() => context.commit('syncCartProducts'));
    },
    deleteCartProduct(context, productId) {
      context.commit('deleteCartProduct', productId);

      return axios
        .delete(`${API_BASE_URL}/api/baskets/products`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
          data: { productId },
        })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
        })
        .catch(() => context.commit('syncCartProducts'));
    },
  },
});
