const slidebar = {
  state: {
    isClosed: false
  },
  mutations: {
    toggleBar (state) {
      state.isClosed = !state.isClosed
    }
  },
  actions: {
    toggleBar ({commit}) {
      commit('toggleBar')
    }
  }
}

export default slidebar
