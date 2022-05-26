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
            <th v-if="showMultiple" class="vt-checkbox-cell">
              <slot>
                <VCheckbox
                  id="mark-all"
                  :checked="isMarkedAllCheckboxes"
                  @checkbox-changed="selectAllCheckboxChanged"
                />
              </slot>
            </th>
            <th v-if="showSingle && !showMultiple"></th>
            <th
              v-for="(header, idx) in mainColumns"
              :key="idx"
              :class="header._options.class"
              :style="header._options.style"
            >
              <div class="vt-header-cell-wrapper">
                <slot
                  :name="header._options.slotName"
                  :header="header"
                > <!-- Slot for transmiting users data to header's cell -->
                  <span>
                    {{ header.displayName }}
                  </span>
                </slot>

                <div
                  v-if="header.sortable"
                  class="vt-select-button-block"
                  @click="sortColumn(header)"
                  :style="header._options.sortArrowStyle"
                >
                  <slot name="arrow-top" :active="header._options.arrowSortState === SORT.ASC">
                    <img :src="sortUp64"
                      alt=""
                      class="arrow-top"
                      :style="header._options.sortArrowStyle.arrowTop"
                    >
                  </slot>
                  <slot name="arrow-bottom" :active="header._options.arrowSortState === SORT.DESC">
                    <img
                      :src="sortDown64"
                      alt=""
                      class="arrow-bottom"
                      :style="header._options.sortArrowStyle.arrowBottom"
                    >
                  </slot>
                  <VSortDropdown
                    :header ="header"
                    @dropdown-click="sortOption"
                  />
                </div>
              </div>
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
            <td v-if="showSingle || showMultiple" class="vt-checkbox-cell">
              <slot>
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

import VSortDropdown from '../components/VSortDropdown.vue'
import makeObjectFromEntries from '../utils/makeObjectFromEntries'
import { sortDown64, loader64, sortUp64, SORT } from '../utils/consts'

export default {
  name: 'main-table',
  components: {
    VCheckbox,
    VSortDropdown
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
      type: String,
      default: 'default'
    }
  },
  emits: ['rowClick', 'mouseHover', 'selectResult'],
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

    const sortedState = makeObjectFromEntries(props.columns, false)

    const sortArrowsState = makeObjectFromEntries(props.columns, '')

    const arrowValue = ref(SORT.DEF)
    const isInitialSort = props.columns.filter(i => i.initialSort)
    if (isInitialSort.length) {
      arrowValue.value = isInitialSort[0].initialSort
      getNumberOfSortDirection.value = isInitialSort[0].displayValue
      const initialSortId = props.columns.map((item, idx) => {
        if (item.initialSort) return idx
        return ''
      })
      const id = initialSortId.join('')
      sortArrowsState[id] = isInitialSort[0].initialSort
    }

    const sortColumn = (header) => {
      const { id, _options, displayValue } = header
      if (_options.isOptionsVisible) {
        sortedState[id] = !_options.isOptionsOpened
      } else {
        ctx.emit('sortValue', header, getNumberOfSortDirection(displayValue, id))
      }
    }

    function getNumberOfSortDirection (nameVal, id) {
      if (getNumberOfSortDirection.value !== nameVal) {
        for (const key in sortArrowsState) sortArrowsState[key] = SORT.DEF
        getNumberOfSortDirection.value = nameVal
        arrowValue.value = SORT.DESC
        sortArrowsState[id] = SORT.DESC
        return arrowValue.value
      }
      switch (arrowValue.value) {
        case SORT.DEF: {
          sortArrowsState[id] = SORT.DESC
          arrowValue.value = SORT.DESC
          return arrowValue.value
        }
        case SORT.DESC: {
          arrowValue.value = SORT.ASC
          sortArrowsState[id] = SORT.ASC
          return arrowValue.value
        }
        case SORT.ASC: {
          arrowValue.value = SORT.DEF
          sortArrowsState[id] = SORT.DEF
          return arrowValue.value
        }
      }
    }
    if (!isInitialSort.length) {
      getNumberOfSortDirection.value = null
    }

    /* eslint-enable */
    const rows = computed(() => {
      return props.dataSource
    })

    const showMultiple = computed(() => {
      return props.showSelect === 'multiple'
    })
    const showSingle = computed(() => {
      return props.showSelect === 'single' || props.showSelect === 'multiple'
    })

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
    })

    const isMarkedAllCheckboxes = ref(false)
    const selectAllCheckboxChanged = (val) => {
      isMarkedAllCheckboxes.value = !val
      if (!val) {
        ctx.emit('selectResult', [...props.dataSource])
      }
      for (let key in rowSelectState) rowSelectState[key] = !val
    }
    const selectPrticularLine = (val, id) => {
      isMarkedAllCheckboxes.value = false
      rowSelectState[id] = !val
      let arr = []
      for (let key in rowSelectState) {
        if (rowSelectState[key]) {
          arr.push(props.dataSource[key])
        }
      }
      if (arr.length) {
        ctx.emit('selectResult', arr)
      }
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
      selectPrticularLine,
      showMultiple,
      showSingle,
      VSortDropdown
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
            span {
              display: block;
              width: 100px;
              max-width: 100px;
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
            th {
              font-family: 'Inter';
              font-style: normal;
              font-weight: 500;
              font-size: 14px;
              line-height: 20px;
              color: #001F2A;
              .#{$prefix}header-cell-wrapper {
                display: flex;
                .#{$prefix}select-button-block {
                  user-select: none;
                  margin-left: 4px;
                  position: relative;
                  width: 20px;
                  height: 20px;
                  border-radius: 6px;
                  display: flex;
                  justify-content: space-around;
                  align-items: center;
                  flex-direction: column;
                  &:hover {
                    cursor: pointer;
                    background: #A0B0B9;
                  }
                }
              }
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
