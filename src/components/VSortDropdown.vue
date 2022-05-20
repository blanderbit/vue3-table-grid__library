<template>
  <div
    v-if="header._options.isOptionsOpened"
    class="vt-select-options"
  >
    <ul>
      <li
        class="vt-option"
        v-for="item of dataList"
        :key="item.id"
        @click="$emit('dropdown-click', header, item.sortDirection)"
      >
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script>
import { SORT } from '../utils/consts'

export default {
  props: {
    header: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const dataList = [
      { id: 0, text: 'Default', value: props.header.displayValue, sortDirection: SORT.DEF },
      { id: 1, text: 'Descending', value: props.header.displayValue, sortDirection: SORT.DESC },
      { id: 2, text: 'Ascending', value: props.header.displayValue, sortDirection: SORT.ASC }
    ]

    return {
      dataList
    }
  }
}
</script>

<style scoped lang="scss">
$prefix: vt-;
.#{$prefix}select-options {
  position: absolute;
  left: 30px;
  top: -10px;
  background: #FFFFFF;
  box-shadow: 0px 4px 20px rgba(2, 61, 151, 0.1);
  border-radius: 6px;
  z-index: 1;
  .#{$prefix}option {
    padding: 4px 6px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #154555;
    list-style: none;
    /* margin-bottom: 4px; */
    &:hover {
      background: #E5FDFD;
      color: #31677B;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
