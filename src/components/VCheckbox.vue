<template>
  <div class="vt-checkbox">
    <input
      type="checkbox"
      class="checkbox-input"
      :checked="checked"
      @change="onChange"
      :id="checkboxId"
    >
    <label
      :for="checkboxId"
      class="checkbox-label"
      :style="labelStyle"
    ></label>
  </div>
</template>

<script>
import { computed } from 'vue'
import { checkboxTick64 } from '../utils/consts'

export default {
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  emits: ['checkbox-changed'],
  setup (props, context) {
    const checkboxId = computed(() => {
      return `vt-checkbox-id-${props.id}`
    })
    const onChange = () => {
      context.emit('checkbox-changed', props.checked, props.id)
    }
    const labelStyle = computed(() => {
      return {
        '--span-center': checkboxTick64
      }
    })

    return {
      onChange,
      checkboxId,
      labelStyle
    }
  }
}
</script>

<style lang="scss" scoped>
.vt-checkbox {
  position: relative;
  & .checkbox-input {
    appearance: none;
    &:checked + .checkbox-label:after {
      opacity: 1;
    }
  }
  & .checkbox-label {
    &:before {
      content: '';
      display: block;
      width: 13px;
      height: 13px;
      background: #31677B;
      border-radius: 3px;
      position: absolute;
      top: 0;
      left: 0;
    }
    &:after {
      content: '';
      display: block;
      width: 10px;
      height: 10px;
      background-image: var(--span-center);
      background-repeat: no-repeat;
      background-size: auto;
      background-position: 0 0;
      position: absolute;
      top: 2px;
      left: 2px;
      opacity: 0;
    }
  }
}
</style>
