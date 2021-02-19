import  Vue from  "vue";
import  VueRouter from "vue-router";
import  Login from "../pages/Login";
import  Home from "../pages/Home";

Vue.use(VueRouter);

let router = new VueRouter({
        routes:[
                {path: "/" ,redirect: "/login" },     //跳转重定向
                {path: "/home" ,component: Home},
                {path: "/login" ,component: Login}
        ]
});

//路由守卫
router.beforeEach((to,from,next)=>{
        if(to.path==="/home" && !sessionStorage.getItem("token")){
                next("/login")    //没有token拦截跳转至登录页
        }
        next();
})
export  default  router;