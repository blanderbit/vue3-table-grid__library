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
      <table v-if="isTableVisible" class="vt-table">
        <thead :style="styleHeader"> <!-- Header block -->
          <tr>
            <th v-if="showSelect" class="vt-checkbox-cell">
              <slot>
                <VCheckbox
                  id="mark-all"
                  :checked="isMarkedAllCheckboxes"
                  @checkbox-changed="selectAllCheckboxChanged"
                />
              </slot>
            </th>
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
            <td v-if="showSelect" class="vt-checkbox-cell">
              <!-- {{ mainColumns[rowIndex] }} -->
              <slot>
                <!-- {{ rowSelectState[rowIndex] }}
                {{ rowIndex }} -->
                <VCheckbox
                  :id="rowIndex"
                  :checked="isMarkedAllCheckboxes || rowSelectState[rowIndex]"
                  @checkbox-changed="selectPrticularLine"
                />
              </slot>
            </td>
            <td
              v-for="(header, idx) in mainColumns"
              :key="idx"
              :style="header._options.style"
              :class=" [
                { 'vt-table__item--fixed-side': header.fixed },
                {'empty' : header.displayValue === 'empty'},
              ]"
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
import { computed, onMounted, ref, reactive } from 'vue'
import useLoader from '../utils/useLoader'
import VCheckbox from '../components/VCheckbox.vue'
// import { useSetupFixedColumnsHook } from '../hooks/use-setup-fixed-columns.hook'

export default {
  name: 'main-table',
  components: {
    VCheckbox
  },
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
    },
    showSelect: {
      type: Boolean,
      default: false
    },
    showMultipleSelect: {
      type: Boolean,
      default: false
    }
  },
  emits: ['mouseHover', 'multipleSelectMod'],
  setup (props, ctx) {
    /* eslint-disable */
    const mainColumns = computed(() => {
      return props.columns
            .filter((header) => header.displayValue && header.displayName)
            .map((item, idx, array) => {
              return {
                ...item,
                id: idx,
                _options: {
                  // creates class name for header table cell
                  class: [
                    `vt-col_name-${item.displayValue}`,
                    { 'vt-table__header__item--fixed-side': item.fixed },
                    { 'empty' : item.displayValue === 'empty' }
                  ],
                  // creates right line of the table, except for the last column
                  style: { 
                    borderRight : setRightBorder(item, idx, array),
                    width: `${item.width}px`,
                    'min-width': `${item.width}px`,
                    left: item.fixed ? setLeftMargin() : ''
                  },
                  //creates name for slot
                  slotName: `header-${item.displayValue}-content`
                }
              }
            })
    })
    console.log(mainColumns)
    /* eslint-enable */
    const rows = computed(() => {
      return props.dataSource
    })
    console.log(rows)

    const rowSelectState = reactive(Object.fromEntries(new Array(props.dataSource.length).fill('l').map((_, idx) => ([idx, false]))))

    const setRightBorder = (item, idx, array) => {
      if (lastFixedTableValue.value === item.displayValue) {
        return '1px solid #154555'
      }
      return idx !== array.length - 1 ? '1px solid #EEF1F2' : ''
    }
    const lastFixedTableValue = computed(() => {
      const fixedColsLength = props.columns.filter(item => item.fixed).length
      const fixedCols = props.columns.filter(item => item.fixed)
      if (fixedColsLength) {
        return fixedCols[fixedColsLength - 1].displayValue
      }
      return null
    })
    const setLeftMargin = () => {
    /* eslint-disable */
      if (setLeftMargin.count === 0) {
        setLeftMargin.count++
        return '12px'
      }
      return `${130 * setLeftMargin.count++}px`
    }
    setLeftMargin.count = 0

    const numberOfFixedTables = computed(() => {
      return props.columns.filter(item => item.fixed).length
    })
    console.log(numberOfFixedTables)

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
      } else if (numberOfFixedTables.value > 0) {
        return {
          'margin-left': `${124 * numberOfFixedTables.value}px`
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
    onMounted(() => {
      const table = document.querySelector('.vt-table')
      if (!table) return

      const applyFixedColumnsHook = mainColumns.value.some(item => item.fixed)

      if (applyFixedColumnsHook) {
        // useSetupFixedColumnsHook(table)
      }
    })

    const isMarkedAllCheckboxes = ref(false)
    const selectAllCheckboxChanged = (val) => {
      isMarkedAllCheckboxes.value = !val
      ctx.emit('multipleSelectMod', [...props.dataSource])
      for (let key in rowSelectState) rowSelectState[key] = !val
    }
    const selectPrticularLine = (val, id) => {
      console.log(val, id)
      rowSelectState[id] = !val
      console.log(rowSelectState)
    }

    return {
      mainColumns,
      rows,
      isTableVisible,
      ...useLoader(props.isLoaderHard, props.isLoading), // isMainBodyOfTableVisible, isLoader
      rowHover,
      bgStyle,
      styleTableWrapper,
      styleHeader,
      isMarkedAllCheckboxes,
      selectAllCheckboxChanged,
      rowSelectState,
      selectPrticularLine
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

    .#{$prefix}table-wrapper {
      /* width: 400px;
      overflow-x: scroll; */

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
      .vt-table {
        border-collapse: collapse;
        &__header {
          &__item {
            &--fixed-side {
              position: absolute;
              left: 0;
              /* background: rgb(153, 215, 153); */
              span {
                width: 100px;
                display: block;
              }
            }
          }
        }
        &__item {
          &--fixed-side {
            position: absolute;
            left: 0;
            top: auto;
            border-bottom-width: 1px;
            padding: 0;
            border-left-width: 1px;
            /* background: rgb(153, 215, 153); */
            span {
              display: block;
              width: 100px;
              max-width: 100px;
              /* padding: 10px; */
              box-sizing: border-box;
            }
          }
        }
        td, th {
          padding: 10px 12px;
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          color: #001F2A;
          text-align: left;
          span {
            clear: both;
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
          }
        }
        .empty {
          background: red;
        }
        thead {
          tr {
            background: #F6F9FB;
            .#{$prefix}checkbox-cell {
              border-right: 1px solid #EEF1F2;
            }
            th {
              font-family: 'Inter';
              font-style: normal;
              font-weight: 500;
              font-size: 14px;
              line-height: 20px;
              color: #001F2A;
              background: #F6F9FB;
            }
          }
        }
        tbody {
          tr {
            .#{$prefix}checkbox-cell {
              border-right: 1px solid #EEF1F2;
            }
            &:hover {
              background: var(--bg-color);
            }
          }
        }
      }
    }
  }
}

</style>
