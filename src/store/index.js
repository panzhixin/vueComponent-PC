import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import setting from '@/setting.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {

    },
    mutations: {

    },
    actions: {

    },
    plugins: [createPersistedState({
        key: setting.title + '-state'
    })]
})

export default store