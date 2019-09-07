import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

let route = new Router({
  mode:"history",
  routes: [
    {
      path:'/',
      redirect:'/registry'
    },
    {
      path: '/music',
      component: ()=>import('../views/music/index.vue'),
      beforeEnter:(to,from,next) =>{
         let token = localStorage.getItem('token'); //获取token
         if(token){
            next(); //如果有token值 就在当前页面 否则跳登录页面
         }else{
           next('/login')
         }
         next();
      }
    },
    {
      path: '/login',
      component: ()=>import('../views/login/index.vue')
    },
    {
      path: '/registry',
      component: ()=>import('../views/registry/index.vue')
    },
    {
      path: '/home',
      component: ()=>import('../views/Home.vue')
    },
    {
      path: '*',
      component: ()=>import('../views/404/index.vue')
    }
  ]
})

export default route;
