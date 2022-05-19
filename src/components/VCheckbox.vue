<template>
  <div class="checkbox">
    <input
      type="checkbox"
      :checked="checked"
      @change="onChange"
      name=""
      id=""
    >
  </div>
</template>

<script>
export default {
  props: {
    checked: {
      type: Boolean,
      default: false
    }
  },
  emits: ['checkbox-changed'],
  setup (props, context) {
    const onChange = () => {
      context.emit('checkbox-changed', props.checked)
    }

    return {
      onChange
    }
  }
}
</script>
