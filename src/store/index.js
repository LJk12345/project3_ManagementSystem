import Vue from "vue";
import Vuex from "vuex";
import func from  "./func.js"
import role from "./role.js"
import classroom from "./classroom.js"
import  dictionary from "./dictionary.js"
import  teacher from "./teacher.js"

import http from "../utils/http.js";


Vue.use(Vuex);

let store=new Vuex.Store({
        //拆分仓库，生成子仓库
        modules: {
                func,
                role,
                dictionary,
                classroom,
                teacher
        },
        state: {             //存储共用数据
               http
        },
        //当仓库中的数据，组件在使用时都要经过一定的计算处理才使用
        //可以在仓库的getters中计算好后再让个组件去使用，getters相当于是计算属性
        getters: {},
        //vuex规定:   mutations节点中的法才可以修改state节点中保存的数据
        //vuex规定：mutations节点中的方法在调用时第一个参数总时state本身
        //vuex规定：mutations节点中的方法组件在调用时必须用$store.commit('方法名',改变的值)进行调用
        mutations: {},
        actions: {}
// vuex规定: actions节点中的方法可以包含异步的耗时的代码，但绝对不可以修改state中的数据
//vuex规定: actions节点中的方法在调用时第-一个参数是一个仓库的上下文对象，里面包的重要属性
// state、 commit、
//vuex规定:actions节点中的方法组件调用时必须用dispatch(来进行间接调用)

})
export default store;