<template>
  <Teleport v-if="open" to="#modal__root">
    <div class="modal__blackout"></div>
    <div class="modal__block" @click="onOutsideClick">
      <div ref="content" class="modal__content">
        <slot></slot>
        <button class="modal__close" @click.prevent="handlerClose">&#10008;</button>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import useModal from '@/hooks/useModal';

export default defineComponent({
  props: {
    open: {type: Boolean},
  },
  setup(props, { emit }) {
    const content = ref(null);

    const { doOpen, doClose } = useModal();

    const handlerClose = () => {
      emit('update:open', false);
    };

    const onOutsideClick = ($event) => {
      if ($event.target !== content.value 
        && $event.target.contains(content.value)) 
      {
        handlerClose();
      }
    };

    watch(() => props.open, (isOpen) => isOpen ? doOpen() : doClose());

    return { handlerClose, onOutsideClick, content }
  }
})
</script>

<style scoped>
.modal__blackout {
  z-index: 1010;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: .75;
  background-color: #000;
}

.modal__block {
  z-index: 1010;
  overflow: auto;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
}

.modal__content {
  position: relative;
  max-width: 1000px;
  margin-top: auto;
  margin-bottom: auto;
  padding: 50px 70px;
  background-color: #fff;
}

.modal__close {
  position: absolute;
  top: 0.75em;
  right: 0.75em;
  padding: 10px;
  line-height: 1;
  border: none;
  background: transparent;
  color: #999;
  font-size: 20px;
  cursor: pointer;
}
</style>

