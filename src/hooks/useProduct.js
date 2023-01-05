import axios from 'axios';
import { ref, reactive } from 'vue';
import numberFormat from '@/helpers/numberFormat';
import API_BASE_URL from '@/config';

export default function() {
  const data = ref(null);

  const status = reactive({
    isLoading: false,
    isFailed: false,
  });

  const fetchProduct = ((productId) => {
    status.isLoading = true;
    status.isFailed = false;
    data.value = null;

    axios
      .get(`${API_BASE_URL}/api/products/${productId}`)
      .then((response) => {
        const product = response.data;

        data.value = {
          title: product.title,
          category: product.category,
          price: product.price,
          priceFormat: numberFormat(product.price),
          colors: product.colors,
          img: product.image?.file.url,
          id: product.id,
        }
      })
      .catch(() => status.isFailed = true)
      .finally(() => status.isLoading = false);
  });

  return { 
    product: data, 
    status, 
    fetchProduct 
  };
}
