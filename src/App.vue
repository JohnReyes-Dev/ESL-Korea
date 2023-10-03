<template>
  <div id="app">
    <nav v-show="shouldItShowAppBar" class="navbar navbar-expand-lg navbar-dark bg-dark">
      <!-- <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01"
        aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation" >
        <span class="navbar-toggler-icon"></span>
      </button> -->
      <!-- <div class="collapse navbar-collapse" id="navbarSupportedContent" > -->
      <router-link class="navbar-brand" to="/">{{name}}</router-link>
      <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
        <li class="nav-item active">
          <!-- <a class="nav-link" href="#">
              <img style="width: 50px; height: 30px;" alt="Vue logo" src="./assets/british_flag.png">
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <img style="width: 50px; height: 30px;" alt="Vue logo" src="./assets/south_korea_flag.png">
            </a> -->
        </li>

      </ul>

      <router-link to="/Class" v-if="isLoggedOut()" v-show="isAdmin">
        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
          Class
        </button>
      </router-link>

      <router-link to="/StudentPage" v-if="isLoggedOut()" v-show="!isAdmin">
        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
          Student Page
        </button>
      </router-link>

      <router-link to="/Register" v-if="isLoggedOut()" v-show="isAdmin">
        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
          Register
        </button>
      </router-link>

      <router-link to="/login" v-if="isLoggedIn()" v-show="isAdmin">
        <button class="btn btn-outline-success my-2 my-sm-0">
          Login
        </button>
      </router-link>

      <button class=" btn btn-outline-success my-2 my-sm-0" type="submit" v-if="isLoggedOut()"
        v-on:click="delete_cookie()">
        Logout
      </button>
      <!-- </div> -->
    </nav>

    <router-view></router-view>
  </div>
</template>


<script>

  window.axios = require("axios");
  import jwt_decode from "jwt-decode";
  export default {
    name: "App",
    components: {
      // MainPage,
    },
    methods: {
      // handleLogin() {
      //   login();
      // },
      // handleLogout() {
      //   logout();
      // },
      isLoggedIn() {
        let token = document.cookie;
        if (token == null || token == "")
          return true;
        else
          return false;
      },
      isLoggedOut() {
        let token = document.cookie;
        if (token == null || token == "")
          return false;
        else
          return true;
      },
      delete_cookie() {
        console.log("clicked");
        document.cookie = "jwt" + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        // location.reload();
        // location.href = "http://localhost/login"

        location.href = "https://johnreyes.xyz/login"
      }
    },
    data() {
      return {
        name: "Hello",
        isAdmin: false,
        shouldItShowAppBar: false
      };
    },
    created() {
      let token = document.cookie;
      if (token != "") {
        var decodedHeader = jwt_decode(token);
        this.name = decodedHeader.name

        if (decodedHeader.classname == "admin") {
          this.isAdmin = true;
        }
        this.shouldItShowAppBar = true;
      }
      else {
        this.shouldItShowAppBar = false;
      }
    }

  };
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* text-align: center; */
    color: #2c3e50;
    /* margin-top: 60px; */
  }
</style>