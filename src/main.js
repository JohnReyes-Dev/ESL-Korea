import Vue from "vue";
import App from "./App.vue";
import "./assets/main.scss";
import axios from "axios";
import store from "./store";
import VueRouter from "vue-router";
// import PostAJob from "./components/PostAJob.vue";
import MainPage from "./components/MainPage.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import Class from "./components/Class.vue";
import StudentPage from "./components/StudentPage.vue";
import Congratulations from "./components/Congratulations.vue";
import jwt_decode from "jwt-decode";

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.use(VueRouter);
const router = new VueRouter({
  routes: [
    // { path: "/PostAJob", component: PostAJob },
    {
      path: "/Login",
      component: Login,
      beforeEnter(to, from, next) {
        let token = document.cookie;
        console.log(token);
        if (token != "") {
          console.log("here");
          var decodedHeader = jwt_decode(token);
          if (decodedHeader.classname == "admin") {
            next("/Class");
          } else {
            next("/StudentPage");
          }
        } else {
          next();
        }
      },
    },
    {
      path: "/Register",
      component: Register,
      beforeEnter(to, from, next) {
        let token = document.cookie;
        if (token != "") {
          // console.log("hello = " + token);
          var base64Url = token.split(".")[1];
          var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          var jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map(function(c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join("")
          );

          // console.log(jsonPayload);
          let currentUser = JSON.parse(jsonPayload);
          console.log(currentUser.classname);
          if (currentUser.classname == "admin") {
            next();
          } else {
            next("/login");
          }
        } else {
          next("/login");
        }
      },
    },
    {
      path: "/Class",
      component: Class,
      beforeEnter(to, from, next) {
        let token = document.cookie;
        if (token != "") {
          // console.log("hello = " + token);
          var base64Url = token.split(".")[1];
          var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          var jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map(function(c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join("")
          );

          // console.log(jsonPayload);
          let currentUser = JSON.parse(jsonPayload);
          if (currentUser.classname == "admin") {
            next();
          } else {
            next("/login");
          }
        } else {
          next("/login");
        }
      },
    },
    { path: "/StudentPage", component: StudentPage },
    { path: "/Congratulations/:params", component: Congratulations },
    {
      path: "/",
      component: MainPage,
      beforeEnter(to, from, next) {
        let token = document.cookie;
        if (token != "") {
          // console.log("hello = " + token);
          var base64Url = token.split(".")[1];
          var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          var jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map(function(c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join("")
          );

          // console.log(jsonPayload);
          let currentUser = JSON.parse(jsonPayload);
          if (currentUser.classname == "admin") {
            next("/class");
          } else {
            next("/studentpage");
          }
        } else {
          next("/login");
        }
      },
    },
  ],
  mode: "history",
});
// function myFunction() {
//   console.log("hello.....................................");
// }

new Vue({
  store,
  render: (h) => h(App),
  router: router,
}).$mount("#app");
