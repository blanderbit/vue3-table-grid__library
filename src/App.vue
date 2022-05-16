<template>
  <div class="home">
    <VTable
      :columns ="columns"
      :dataSource ="desserts"
      :isLoading ="true"
      :isLoaderSoft ="true"
      :isLoaderHard ="false"
      :tableHeight ="''"
      :headerColor ="'#F6F9FB'"
      :isHeaderSticky ="false"
      @row-click="indexRow"
      @sort-value="sortColumn"
      @mouseHover ="showHoverCellData"
    >
      <!-- <template #sorting-arrows>
        <img src="./assets/img/sort-down.svg" alt="">
      </template> -->

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
import { reactive, ref } from 'vue'
import VTable from './components/VTable.vue'

const columns = reactive([
  {
    displayName: 'Dessert (100g serving)',
    displayValue: 'name',
    sortable: true,
    sortArrowBackground: '#f0f',
    isShownSortableWindow: true
  },
  {
    displayName: 'Calories',
    displayValue: 'calories',
    sortable: true
  },
  {
    displayName: 'Fat (g)',
    displayValue: 'fat',
    sortable: true
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
  },
  {
    displayName: 'Pizza',
    displayValue: 'pizza'
  }
])
const dessertsInitial = reactive([
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
    name: 'burgerssss',
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

const desserts = ref(dessertsInitial)

const indexRow = rowData => {
  console.log(rowData)
}
const showHoverCellData = (cellData, e) => {
  console.log(cellData, e)
}

const sortBy = ref('')
const sortColumn = (nameVal, sortVal) => {
  sortBy.value = nameVal
  const arr = ['def', 'desc', 'asc']
  switch (arr[sortVal]) {
    case 'def':
      desserts.value = dessertsInitial
      break
    case 'desc':
      desserts.value = [...dessertsInitial].sort((a, b) => (a[sortBy.value] > b[sortBy.value]) ? 1 : ((b[sortBy.value] > a[sortBy.value]) ? -1 : 0)).reverse()
      break
    case 'asc':
      desserts.value = [...dessertsInitial].sort((a, b) => (a[sortBy.value] > b[sortBy.value]) ? 1 : ((b[sortBy.value] > a[sortBy.value]) ? -1 : 0))
      break
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
body, ul {
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
