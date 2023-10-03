import axios from "axios";

const state = {
  todos: null,
  studentImages: null,
  studentAudio: null,
  studentAudioForStudentPage: [{}],
  didStudentFinish: null,
  url: "https://johnreyes.xyz",
  // url: "https://localhost",
};

const getters = {
  allTodos: (state) => state.todos,
  fetchStudentImages: (state) => state.studentImages,
  fetchStudentAudio: (state) => state.studentAudio,
  fetchStudentAudioForStudentPage: (state) => state.studentAudioForStudentPage,
  checkIfStudentFinished: (state) => state.didStudentFinish,
};

const actions = {
  //   allTodos: (state) => state.todos,

  async fetchTodos({ commit }) {
    let token = document.cookie;
    if (token != "") {
      console.log("hello = " + token);
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
      let currentUser = JSON.parse(jsonPayload);
      if (currentUser) {
        axios.defaults.withCredentials = true;
        let response = await axios.get(
          state.url + "/api/get/" + currentUser.id,
          {
            withCredentials: true,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              // Authorization: 'Bearer ' + username
            },
          }
        );

        commit("setTodos", response.data);
      } else {
        // next("/login");
      }
    } else {
      // next("/login");
    }
  },

  async FetchStudentNames({ commit }, userInfo) {
    axios.defaults.withCredentials = true;
    // let response = await axios.get(
    //   state.url + "/api/getStudentName/" + className,
    //   {
    //     withCredentials: true,
    //     headers: {
    //       "Access-Control-Allow-Origin": "*",
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    console.log("className = " + userInfo.className);
    console.log("unitNumber = " + userInfo.unitNumber);
    let response = await axios.get(state.url + "/api/getStudentName/", {
      params: {
        className: userInfo.className,
        unitNumber: userInfo.unitNumber,
      },
      withCredentials: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });

    commit("setTodos", response.data);
  },

  async CheckIfStudentFinished({ commit }, userInfo) {
    axios.defaults.withCredentials = true;
    let response = await axios.get(state.url + "/api/checkIfStudentFinished/", {
      params: {
        className: userInfo.className,
        unitNumber: userInfo.unitNumber,
      },
      withCredentials: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });

    commit("checkIfStudentFinished", response.data);
  },

  async FetchStudentImages({ commit }) {
    axios.defaults.withCredentials = true;
    let response = await axios.get(state.url + "/api/getStudentImages", {
      withCredentials: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    commit("fetchStudentImages", response.data);
  },

  async FetchStudentAudio({ commit }, userInfo) {
    // this.studentAudio = [];

    axios.defaults.withCredentials = true;
    let response = await axios.get(
      state.url + "/api/getStudentAudio/",

      {
        params: {
          usersID: userInfo.usersID,
          unitNumber: userInfo.unitNumber,
        },
        withCredentials: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
    commit("fetchStudentAudio", response.data);
  },

  async FetchStudentAudioForStudentPage({ commit }, userInfo) {
    // this.studentAudio = [];

    axios.defaults.withCredentials = true;
    let response = await axios.get(state.url + "/api/getAllUnitStudentAudio/", {
      params: {
        usersID: userInfo.usersID,
      },
      withCredentials: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
    commit("fetchStudentAudioForStudentPage", response.data);
  },

  async deleteTodo({ commit }, id) {
    await axios.delete(`http://localhost:5000/delete/${id}`).then((res) => {
      console.log(res.status === 200, "Got OK status code");
      // this.testing();
    });

    commit("removeTodo", id);
  },
};

const mutations = {
  //   allTodos: (state) => state.todos,
  fetchStudentImages: (state, studentImages) =>
    (state.studentImages = studentImages),

  fetchStudentAudio: (state, studentAudio) =>
    (state.studentAudio = studentAudio),

  fetchStudentAudioForStudentPage: (state, studentAudioForStudentPage) =>
    (state.studentAudioForStudentPage = studentAudioForStudentPage),

  checkIfStudentFinished: (state, didStudentFinish) =>
    (state.didStudentFinish = didStudentFinish),

  setTodos: (state, todos) => (state.todos = todos),

  removeTodo: (state, id) =>
    (state.todos = state.todos.filter((todo) => todo.id !== id)),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
