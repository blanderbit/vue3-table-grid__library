import { reactive } from 'vue'

export default function makeObjectFromEntries (makeFrom, val) {
  return reactive(Object.fromEntries(new Array(makeFrom.length).fill('l').map((_, idx) => ([idx, val]))))
}
