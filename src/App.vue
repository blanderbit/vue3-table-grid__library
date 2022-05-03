<template>
  <div class="home">
    <VTable
      :columns ="columns"
      :dataSource ="desserts"
      :isLoading ="true"
      :isLoaderSoft ="true"
      :isLoaderHard ="false"
      :backgroundColor ="'#f0f'"
      @row-click="indexRow"
      @mouseHover ="showHoverCellData"
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
import { reactive } from 'vue'
import VTable from './components/VTable.vue'

const columns = reactive([
  {
    displayName: 'Dessert (100g serving)',
    displayValue: 'name'
  },
  {
    displayName: 'Calories',
    displayValue: 'calories'
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
    displayValue: 'burger'
  }
])
const desserts = reactive([
  {
    name: 'Frozen Yogurt',
    calories: 45,
    fat: 6.0,
    carbs: 24,
    management: null
  },
  {
    name: 'Ice cream sandwich',
    calories: 345,
    fat: 9.0,
    carbs: 34,
    management: null
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    management: null,
    burger: 'eat'
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    management: 'f'
  },
  {
    name: '5555555555',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    management: 'f',
    burger: 'netu'
  }
])

const indexRow = rowData => {
  console.log(rowData)
}
const showHoverCellData = (cellData, e) => {
  console.log(cellData, e)
}
</script>

<style lang="scss">
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
