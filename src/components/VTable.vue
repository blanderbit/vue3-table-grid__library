<template>
  <div class="vt-container">
    <div
      class="vt-table-wrapper"
      :style="styleTableWrapper"
    >
      <div v-if="isLoading" class="vt-loader-block">

        <div v-if="isLoaderSoft" >
          <div v-if="isLoader" class="vt-loader-soft">
            <slot name="loader-soft"> <!-- Slot which shows loader -->
              <img src="../assets/img/loader.gif" alt="">
            </slot>
          </div>
        </div>

        <div v-if="isLoaderHard">
          <div v-if="isLoader" class="vt-loader-hard">
            <slot name="loader-hard"> <!-- Slot which shows loader -->
              <img src="../assets/img/loader.gif" alt="">
            </slot>
          </div>
        </div>

      </div>
      <table v-if="isTableVisible">
        <thead :style="styleHeader"> <!-- Header block -->
          <tr>
            <th
              v-for="(header, idx) in mainColumns"
              :key="idx"
              :class="header._options.class"
              :style="header._options.style"
            >
              <slot
                :name="header._options.slotName"
                :header="header"
              > <!-- Slot for transmiting users data to header's cell -->
                <span>
                  {{ header.displayName }}
                </span>
              </slot>
            </th>
          </tr>
        </thead>
        <tbody v-if="isMainBodyOfTableVisible"> <!-- Main body block -->
          <tr
            v-for="(row, rowIndex) in rows"
            :key="rowIndex"
            @click="$emit('rowClick', row)"
            @mouseover="rowHover(row, $event)"
            :style="bgStyle"
          > <!-- rowClick function emits index of the row on the top -->
            <td
              v-for="(header, idx) in mainColumns"
              :key="idx"
              :style="header._options.style"
            >
              <slot
                :name="`line-${rowIndex}_cell-${idx}`"
                :bodyCell="row[header.displayValue]"
              >
                <span> <!-- Slot for transmiting users data to main body table cell -->
                  {{ row[header.displayValue] }}
                </span>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="vt-empty-table">
        <slot name="empty-table"> <!-- Slot will be shown in case no data was provided -->
          No data provided
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import useLoader from '../utils/useLoader'

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
    isLoading: { // This prop switch off/on loader
      type: Boolean,
      default: true
    },
    isLoaderSoft: { // This prop switch off/on soft loader
      type: Boolean,
      default: true
    },
    isLoaderHard: { // This prop switch off/on hard loader
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: '#E5FDFD'
    },
    tableHeight: {
      type: String,
      default: ''
    },
    isHeaderSticky: {
      type: Boolean,
      default: false
    }
  },
  emits: ['mouseHover'],
  setup (props, ctx) {
    /* eslint-disable */
    const mainColumns = computed(() => {
      return props.columns
            .filter((header) => header.displayValue && header.displayName)
            .map((item, idx, array) => {
              return {
                ...item,
                _options: {
                  // creates class name for header table cell
                  class: `vt-col_name-${item.displayValue}`,
                  // creates right line of the table, except for the last column
                  style: { borderRight : idx !== array.length - 1 ? '1px solid #EEF1F2' : '' },
                  //creates name for slot
                  slotName: `header-${item.displayValue}-content`
                }
              }
            })
    })
    /* eslint-enable */

    const rows = computed(() => {
      return props.dataSource
    })

    const isTableVisible = computed(() => {
      return props.dataSource.length && props.columns.length
    })
    const rowHover = (rowData, hoverEvent) => {
      ctx.emit('mouseHover', rowData, hoverEvent)
    }
    const bgStyle = computed(() => {
      return {
        '--bg-color': props.backgroundColor
      }
    })
    const styleTableWrapper = computed(() => {
      if (props.tableHeight.length) {
        return {
          height: props.tableHeight + 'px',
          'overflow-y': 'scroll'
        }
      }
      return {}
    })
    const styleHeader = computed(() => {
      if (props.isHeaderSticky) {
        return {
          position: 'sticky',
          top: 0
        }
      }
      return {}
    })

    return {
      mainColumns,
      rows,
      isTableVisible,
      ...useLoader(props.isLoaderHard, props.isLoading), // isMainBodyOfTableVisible, isLoader
      rowHover,
      bgStyle,
      styleTableWrapper,
      styleHeader
    }
  }
}
</script>

<style scoped lang="scss">
$prefix: vt-;
.vt- {
  &container {
    box-shadow: 0px 4px 20px rgba(2, 61, 151, 0.1);
    border-radius: 8px;
    width: fit-content;
    padding: 12px;
    position: relative;
    .#{$prefix}loader-soft {
      background: #efefef8a;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 150px;
      }
    }
    .#{$prefix}loader-hard {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 150px;
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
      thead {
        tr {
          background: #F6F9FB;
          th {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            line-height: 20px;
            color: #001F2A;
          }
        }
      }
      tbody {
        tr:hover {
          background: var(--bg-color);
        }
      }
    }
  }
}

</style>
