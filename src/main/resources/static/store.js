import Vue from './libs/vue.esm.browser.js'
import Vuex from './libs/vuex.esm.browser.js'
Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
       users: [],
       channels: []
    },
    mutations: {
      displayUsers(state, users){
        state.users = users;
      },
      displayChannels(state, channels){
        state.channels = channels;
      }
    }
})