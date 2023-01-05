<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <BaseFormField :title="title" :error="error">
    <input
      class="form__input"
      :type="type"
      name="name"
      :placeholder="placeholder"
      v-model="dataValue"
    >
  </BaseFormField>
</template>

<script>
import { defineComponent } from 'vue';
import formFieldMixin from '@/mixins/formFieldMixin';

export default defineComponent({
  props: {
    type: {
      default: 'text',
    },
  },
  mixins: [formFieldMixin],
});
</script>
