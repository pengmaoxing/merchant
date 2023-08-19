import { login } from '@/modules/login/api/login'
const user = {
  state: {
    isReload: true
  },
  mutations: {
    setReload: (state) => {
      state.isReload = false
    }
  },
  actions: {
    /*
     * 登录
     * */
    login ({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.password).then(response => {
          sessionStorage.username = userInfo.username;
          sessionStorage.merchantId = response.obj.merchantId;
          sessionStorage.token = response.obj.token;
          sessionStorage.userType=response.obj.userType;
          sessionStorage.name=response.obj.name;
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    /*
     * 前端登出
     * */
    logout ({commit}) {
      return new Promise((resolve) => {
        sessionStorage.clear();
        resolve()
      })
    },
    /*
    * 首次加载路由Flag
    * */
    setReload ({commit}) {
      commit('setReload')
    }
  }
};

export default user
