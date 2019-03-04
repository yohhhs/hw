import * as types from './mutation-types'

const mutations = {
  [types.SET_TAGSLIST](state, tagsList) {
    state.tagsList = tagsList
  },
  [types.SET_CURRENTROUTE](state, newRoute) {
    state.currentRoute = newRoute
  }
}

export default mutations
