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
            <th
              v-for="(header, idx) in mainColumns"
              :key="idx"
              :class="header._options.class"
              :style="{background: headerColor, ...header._options.style}"
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
                  v-if="sortable"
                  class="vt-select-button-block"
                  @click="sortColumn(header.id, header._options.isOptionsVisible, header.displayValue)"
                  :style="{ background: sortArrowColor }"
                >
                  <slot name="sorting-arrows">
                    <img src="../assets/img/sort-up.svg"
                      alt=""
                      class="arrow-top"
                    >
                    <img
                      src="../assets/img/sort-down.svg"
                      alt=""
                      class="arrow-bottom"
                    >
                  </slot>
                  <div
                    v-if="header._options.isOptionsVisible"
                    class="vt-select-options"
                  >
                    <ul>
                      <li
                        class="vt-option"
                        @click="sortOption(header.displayValue, SORT.DEF)"
                      >
                        Default
                      </li>
                      <li
                        class="vt-option"
                        @click="sortOption(header.displayValue, SORT.DESC)"
                      >
                        Descending
                      </li>
                      <li
                        class="vt-option"
                        @click="sortOption(header.displayValue, SORT.ASC)"
                      >
                        Ascending
                      </li>
                    </ul>
                  </div>
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
import {
  computed,
  reactive,
  watch,
  ref
} from 'vue'
import useLoader from '../utils/useLoader'

import { SORT } from '../utils/consts'

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
    },
    sortable: {
      type: Boolean,
      default: false
    },
    isShownSortableWindow: {
      type: Boolean,
      default: false
    },
    headerColor: {
      type: String,
      default: ''
    }
  },
  emits: ['mouseHover', 'sortValue'],
  setup (props, ctx) {
    watch(() => props.dataSource, () => {
      console.log('prop dataSource changed', props.dataSource)
    })
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
                    left: item.fixed ? setLeftMargin() : '',
                  },
                  //creates name for slot
                  slotName: `header-${item.displayValue}-content`,
                  isOptionsVisible: sortedState[idx],
                }
              }
            })
    })
    /* eslint-enable */

    const sortedState = reactive(Object.fromEntries(new Array(props.columns.length).fill('l').map((_, idx) => ([idx, false]))))

    const sortColumn = (id, isWindowVisible, nameVal) => {
      if (props.isShownSortableWindow) {
        sortedState[id] = !isWindowVisible
      } else {
        ctx.emit('sortValue', nameVal, getNumber(nameVal))
      }
    }
    const someVar = ref(0)
    const getNumber = nameVal => {
      someVar.value++
      if (getNumber.value !== nameVal) {
        getNumber.value = nameVal
        getNumber.number = 0
        return getNumber.number
      }
      if (getNumber.number !== 2) {
        return ++getNumber.number
      } else {
        getNumber.number = 0
        return getNumber.number
      }
    }
    getNumber.value = null
    getNumber.number = 0

    const rows = computed(() => {
      return props.dataSource
    })

    const sortArrowColor = computed(() => {
      let value = null
      console.log(someVar.value)
      // console.log(getNumber.number)
      switch (getNumber.number) {
        case 0: value = props.headerColor
          break
        case 1: value = 'linear-gradient(to bottom, #1e5799 0%, #2989d8 50%, #c60000 50%, #e20000 100%)'
          break
        case 2: value = 'linear-gradient(to bottom, #ce27ce 0%,#ce27ce 50%,#ce27ce 50%,#3ef900 50%,#3ef900 50%,#3ef900 100%)'
          break
      }
      return value
    })

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
    const sortOption = (nameVal, sortVal) => {
      console.log(nameVal, sortVal)
      ctx.emit('sortValue', nameVal, sortVal)
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
      sortColumn,
      sortOption,
      SORT,
      sortArrowColor
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
      /* width: 400px; */
      /* overflow-x: scroll; */

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
                }
              }
            }
          }
        }
        tbody {
          tr {
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
