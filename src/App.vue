<template>
  <div class="home">
    <VTable
      :columns ="columns"
      :dataSource ="desserts"
      :isLoading ="true"
      :isLoaderSoft ="true"
      :isLoaderHard ="false"
      :tableHeight ="''"
      :isHeaderSticky ="false"
      :showSelect ="'default'"
      @row-click="indexRow"
      @mouseHover ="showHoverCellData"
      @select-result ="showSelected"
    >
      <!-- <template #header-calories-content="{header}" >
        {{ header.displayName + 'lkj' }}
      </template> -->

      <!-- <template #header-calories-content >
        My content
      </template> -->

      <!-- <template #line-0_cell-3="{bodyCell}">
        {{ bodyCell * 2 }}
      </template> -->

      <!-- <template #loader-soft>
        <img src="./assets/img/loader.gif" alt="">
      </template> -->

      <!-- <template #empty-table>
        Enter some data
      </template> -->

    </VTable>
  </div>
</template>

<script setup>
/* eslint-disable */
import { reactive } from 'vue'
import VTable from './components/VTable.vue'

const columns = reactive([
  {
    displayName: 'Dessert (100g serving)',
    displayValue: 'name'
  },
  {
    displayName: 'Calories',
    displayValue: 'calories',
    sortable: true
  },
  {
    displayName: 'Fat (g)',
    displayValue: 'fat'
  },
  {
    displayName: 'Carbs (g)',
    displayValue: 'carbs'
  },
  {
    displayName: 'Management',
    displayValue: 'management'
  },
  {
    displayName: 'Burger',
    displayValue: 'burger',
    width: '300'
  },
  {
    displayName: 'Pizza',
    displayValue: 'pizza',
    width: '300'
  }
])
const desserts = reactive([
  {
    name: 'Frozen Yogurt',
    calories: 45,
    fat: 6.0,
    carbs: 24,
    management: null,
    empty: ''
  },
  {
    name: 'Ice cream sandwich',
    calories: 345,
    fat: 9.0,
    carbs: 34,
    management: null,
    empty: ''
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    management: null,
    burger: '343',
    empty: ''
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    management: 'f',
    pizza: 'grande',
    empty: ''
  },
  {
    name: '5555555555',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    management: 'f',
    empty: ''
  },
  {
    name: 'Ice cream',
    calories: 34,
    fat: 4.7,
    carbs: 67,
    management: null,
    burger: '34344444',
    empty: ''
  },
  {
    name: 'Pudding',
    calories: 2345,
    fat: 2.2,
    carbs: 98,
    management: 'f',
    pizza: 'pizzza',
    empty: ''
  },
  {
    name: 'Salad with apples',
    calories: 555,
    fat: 6.2,
    carbs: 98,
    management: 'f',
    empty: ''
  }
])

const indexRow = rowData => {
  console.log(rowData)
}
const showHoverCellData = (cellData, e) => {
  console.log(cellData, e)
}
const showSelected = array => {
  console.log(array)
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
