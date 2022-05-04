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
1. In the project where you want to install the library. In command line type - npm i <...path to the folder with library>.

2. In vue.config.js file in your project, you will need to add the fallowing code:
  const path = require('path')

  chainWebpack: config => {
    config.resolve.symlinks(false)
    config.resolve.alias.set( 'vue', path.resolve('./node_modules/vue'))  
  }

3. To start using the library, import it in your file:
  import { VTable } from 'table-grid-library'

4. Register component:
  components: {
    VTable
  }
```
### How to customize heder cell
```
The name of template should consist of the words - header-...-content,
and the name of the value of the header cell - #header-calories-content
Put the value of the cell that you want to change between, and put
your content inside template tag:

<template #header-calories-content >
  Your custom content
</template>

If you want to customize your current data into cell, receive the data
in props "{header}". Then take the value of the cell from displayName
property:

<template #header-calories-content="{header}" >
  {{ header.displayName }}
</template>
```
### How to customize table body cell
```
The name of template consist of the number of the line - line-<number>
(first line of the table starts from 0) and number of the call - 
cell-<number> (first cell in line starts from 0). The numbers of
line and cell must be linked with _ .
In this example we transmit our custom content to the first cell of
the first line:

<template #line-0_cell-0>
  Your custom content
</template>

If you want to customize your current data into cell, receive the data
in props "{bodyCell}":

<template #line-0_cell-3="{bodyCell}">
  {{ bodyCell }}
</template>
```

### How to add your color on row hover
```
In order to apply your custom color to row hover, you need to pass to the
component backgroundColor prop a string with the color you need.
Example:

:backgroundColor ="'#f0f'"

```
### How to make a fixed height of the table
```
Use tableHeight prop to transmit a string value into the component, the size 
of height of the table you want in pixels.
Example:

:tableHeight ="'200'"

It means that the table will have 200px height

```
### How to fix header of the table
```
Use isHeaderSticky prop. To make header sticky transmit boolean value true to
the prop. To make it not sticky, transmit false or just skip this prop.
Example:

:isHeaderSticky ="true"
```
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
