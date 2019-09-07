import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)


const store = new Vuex.Store({
    state:{
        name:""
    },
    mutations:{
        setName(state,userName){
            state.name = userName;
        }
    }
})
window.store = store;
export default store;