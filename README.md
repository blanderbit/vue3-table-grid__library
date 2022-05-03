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
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
