<template>
  <div class="vt-container">
    <div v-if="isLoading" class="loader-block">
      <div v-if="isLoader" class="loader">
        <slot name="loader"> <!-- Slot which shows loader -->
          <img src="../assets/img/loader.gif" alt="">
        </slot>
      </div>
    </div>
    <table v-if="dataSource.length && columns.length">
      <thead> <!-- Header block -->
        <tr>
          <th
            v-for="(header, idx) in settings.headers"
            :key="idx"
            :class="header._otoptions.class"
            :style="header._otoptions.style"
          >
            <slot
              :name="header._otoptions.slotName"
              :header="header"
            > <!-- Slot for transmiting users data to header's cell -->
              <span>
                {{ header.displayName }}
              </span>
            </slot>
          </th>
        </tr>
      </thead>
      <tbody> <!-- Main body block -->
        <tr
          v-for="(element, idxLine) in settings.mainBodyItems"
          :key="idxLine"
          @click="$emit('rowClick', element)"
        > <!-- rowClick function emits index of the row on the top -->
          <td
            v-for="(header, idx) in settings.headers"
            :key="idx"
            :style="header._otoptions.style"
          >
            <slot
              :name="`line-${idxLine}_cell-${idx}`"
              :bodyCell="element[header.displayValue]"
            >
              <span> <!-- Slot for transmiting users data to main body table cell -->
                {{ element[header.displayValue] }}
              </span>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="empty-table">
      <slot name="empty-table"> <!-- Slot will be shown in case no data was provided -->
        No data provided
      </slot>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  name: 'main-table',
  props: {
    dataSource: { // Here must be trasmited an array with objects for showing header
      type: Array,
      default: () => []
    },
    columns: { // Here must be trasmited an array with objects for showing main body
      type: Array,
      default: () => []
    },
    isLoading: { // This prop switch off or switch on loader, Boolean property is expected
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    /* eslint-disable */
    const settings = computed(() => {
      return {
        headers: props.columns
                  .filter((header) => header.displayValue && header.displayName)
                  .map((item, idx, array) => {
                    return {
                      ...item,
                      _otoptions: {
                        // creates class name for header table cell
                        class: `col_name-${item.displayValue}`,
                        // creates right line of the table, except for the last column
                        style: idx !== array.length - 1 ? 'border-right: 1px solid #EEF1F2' : '',
                        //creates name for slot
                        slotName: `header-${item.displayValue}-content`
                      }
                    }
                  }),
        mainBodyItems: props.dataSource
      }
    })
    /* eslint-enable */

    const isLoader = ref(true)
    setTimeout(() => {
      isLoader.value = false
    }, 1000)

    return {
      settings,
      isLoader
    }
  }
}
</script>

<style scoped lang="scss">
.vt {
  &-container {
    box-shadow: 0px 4px 20px rgba(2, 61, 151, 0.1);
    border-radius: 8px;
    width: fit-content;
    padding: 12px;
    .loader {
      background: #efefef8a;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 200px;
      }
    }
    table {
      border-collapse: collapse;
      td, th {
        padding: 10px 12px;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        color: #001F2A;
        text-align: left;
      }
    }
  }
}

</style>
