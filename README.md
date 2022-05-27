# table-grid-library

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
### Library installment
```
1. In the project where you want to install the library, in command line
write a command - npm i @blanderbit/vue3-table-grid.

2. In vue.config.js file in your project, you will need to add the 
fallowing code:
  const path = require('path')

  chainWebpack: config => {
    config.resolve.symlinks(false)
    config.resolve.alias.set( 'vue', path.resolve('./node_modules/vue'))  
  }

3. To start using the library, import the library in your file:
  import { VTable } from '@blanderbit/vue3-table-grid'

4. Register component:
  components: {
    VTable
  }

5. Put VTable component in your template where you want to use it:
<template>
  <div class="home">
    <VTable></VTable>
  </div>
</template>
```
### How to customize heder cell
```
Using tag <template> we can customize a header cell.
The name of template should consist of the words - header-...-content,
and the name of the value of the header cell - #header-calories-content
Put the value of the cell that you want to change between, and put
your content inside template tag.
Example:

<template #header-calories-content >
  Your custom content
</template>

If you want to customize your current cell data, receive the data
in props "{header}". Then take the value of the cell from displayName
property.
Example:

<template #header-calories-content="{header}" >
  {{ header.displayName }}
</template>
```
### How to customize table body cell
```
Using tag <template> we can customize a body cell.
The name of template must consist of the number of the line - 
line-<number> (first line of the table starts from 0) and number 
of the cell - cell-<number> (first cell in line starts from 0). 
The line and cell numbers must be linked with _ .
In this example we transmit our custom content to the first cell of
the first line.
Example:

<template #line-0_cell-0>
  Your custom content
</template>

If you want to customize your current data into cell, receive the data
in props "{bodyCell}":

<template #line-0_cell-0="{bodyCell}">
  {{ bodyCell }}
</template>
```
### How to get data on mouse hover
```
You can get the data of the row you hover. For this, add to props
'@hover-row' listener. The listener will triger your function. The 
function will receive two arguments: 1st - object of the table row, 
2nd - mouse hover event.
Example:

  <VTable
    @hover-row ="showHoverCellData"
  >
  </VTable>

  function showHoverCellData (objectCell, event) {}

```
### How to get data on mouse click
```
You can get the data of the row you click. For this, add to props
'@row-click' listener. The listener will triger your function. The 
function will receive as an arguments the object of the table row.
Example:

  <VTable
    @row-click ="indexRow"
  >
  </VTable>

  function indexRow (rowData) {}

```
### How to add your color on row hover
```
In order to apply your custom color to row hover, you need to pass to the
component backgroundColor prop a string with the color you need.
Example:

  <VTable
    :backgroundColor ="'#f0f'"
  >
  </VTable>

```
### How to make a fixed height of the table
```
Use tableHeight prop to transmit a string value into the component, 
the size of height of the table you want in pixels.
Example:

  <VTable
    :tableHeight ="'200'"
  >
  </VTable>

It means that the table will have 200px height

```
### How to fix the header of the table
```
Use isHeaderSticky prop. To make header sticky transmit boolean value 
true to the prop. To make it not sticky, transmit false or just delete 
this prop.
Example:

  <VTable
    :isHeaderSticky ="true"
  >
  </VTable>

```
### How to change the color of the header
```
To chage the color of the header, provide a 'headerColor' prop with
the needed color string.
Example:

  <VTable
    :headerColor ="'#f0f'"
  >
  </VTable>

```
### How to attach columns to the left
```
To attech some column left, you need to provide a 'fixed' property with
the needed boolean value to the object of the column you want to attach.
Example:

[
  {
    displayName: 'column N',
    displayValue: 'fat',
    fixed: true
  }
]

```
### How to make a column of certain width
```
You need to provide a 'width' string property with number of width you
want to apply to the column, to the object of the column you want 
to change. 
Example:

[
  {
    displayName: 'column N',
    displayValue: 'fat',
    width: '300'
  }
]

```
### How to make a column sortable
```
To make column sortable you need to add a key 'sortable' with a boolean
 value to the object of a column.
Example:
[
  {
    displayName: 'column N',
    displayValue: 'fat',
    sortable: true
  }
]

There is also a possibility to set an initial sorting value for a column. 
You need to add a property 'initialSort' to the object of the column you 
want to sort with the value of sorting 'asc' or 'desc'
Example:

[
  {
    displayName: 'column N',
    displayValue: 'fat',
    initialSort: 'desc'
  }
]

```
### How to show sortable window
```
On the sort button can be called a window with options, to choose wich kind
of sorting method you need. To activate this window you need to pass a 
boolean value into a 'isShownSortableWindow' key in the object of a column.
Example:

[
  {
    displayName: 'column N',
    displayValue: 'fat',
    isShownSortableWindow: true
  }
]

```
### How to apply custom arrows for sorting columns
```
Make two templates with names: #arrow-top, #arrow-bottom. In each 
template put 'img' tag of the arrow. Receiving "active" prop, you can 
apply your own class to your 'img' tag.
Example:

<template #arrow-top="{active}">
  <img src="arrow-top.svg"
    alt=""
    :class="{ arrowStyle : active }"
  >
</template>
<template #arrow-bottom="{active}">
  <img src="arrow-bottom.svg"
    alt=""
    :class="{ arrowStyle : active }"
  >
</template>
```
### How to change a background for sorting arrows
```
You need to add a key 'sortArrowBackground' to the object of needed column, 
with the string value of the color you need.
Example:

[
  {
    displayName: 'column N',
    displayValue: 'fat',
    sortArrowBackground: '#f0f'
  }
]

```
### How to make arrow selection
```
There are three types of arrow selection. To choose the slection mode you 
need to add 'showSelect' prop and pass one of three string values:
'default' - without any selection.
'single' - selecting checkbox will appear in the beginning of each line.
'multiple' - in adition to checkboxes in the beginning of each line, one 
checkbox will appear in the left top corner, which will give the possibility 
to mark all lines.
Example:

  <VTable
    :showSelect ="single"
  >
  </VTable>

To receive the result, you need to apply to props an event listener 
'select-result'.
Example:

  @select-result="showSelected"

  function showSelected (value) {}
```
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
