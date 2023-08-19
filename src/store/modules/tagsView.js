const tagsView = {
  state: {
    visitedViews: []
  },
  mutations: {
    /*
     * 添加已浏览路径
     * */
    addVisitedView (state, view) {
      if (state.visitedViews.some(v => v.path === view.path)) return
      state.visitedViews.push(view)
    },
    /*
    * 删除已浏览路径
    * */
    deleteVisitedView (state, view) {
      state.visitedViews.forEach((item, index) => {
        if (item.path === view.path) {
          state.visitedViews.splice(index, 1)
        }
      })
    }
  },
  actions: {
    addVisitedView ({ commit }, view) {
      commit('addVisitedView', view)
    },
    deleteVisitedView ({ commit }, view) {
      return new Promise(resolve => {
        commit('deleteVisitedView', view)
        resolve()
      })
    }
  }
}

export default tagsView
