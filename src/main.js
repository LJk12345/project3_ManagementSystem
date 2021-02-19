import Vue from 'vue';
import './assets/reset.css';
import router from './router'
import store from './store';
import app from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import http from './utils/http.js'

Vue.use(ElementUI);
Vue.prototype.$http = http

//创建根实例，并渲染根组件
new Vue({
        el:'#app',
        components:{app},
        template: "<app />", //如果自定义组件，标签中间没有内容可以写为但标记形式
        router,
        store
})