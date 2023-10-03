<template>
  <div class="vue-tempalte">
    <div class="grid-container">
      <!-- <div class="item1">Header</div> -->

      <div class="item2">
        <!-- <div>
          <label>Select Class Name</label>
          <select class="form-control" v-model="selectedId" name="cars" id="dropDownStyle" @change="getStudentFromList">
            <option value="2A">2A</option>
            <option value="2B">2B</option>
            <option value="2C">2C</option>
            <option value="2D">2D</option>
            <option value="12D">12D</option>
          </select>

        </div> -->

        <div>
          <label>Select Week</label>
          <select
            class="form-control"
            v-model="selectedUnitNumber"
            name="cars"
            id="dropDownStyle"
            @change="getStudentFromList"
          >
            <option value="1">Unit 1 or 2</option>
            <option value="2">Unit 3 or 4</option>
            <option value="3">Unit 5 or 6</option>
            <option value="4">Unit 7 or 8</option>
            <option value="5">Unit 9 or 10</option>
            <option value="6">Unit 11 or 12</option>
            <option value="7">Unit 13 or 14</option>
            <option value="8">Unit 15 or 16</option>
            <option value="9">Unit 17 or 18</option>
          </select>
        </div>
        <!-- <input type="submit" value="Submit" /> -->
        <!-- </form> -->
        <br />
        <ul id="example-1">
          <li
            v-for="item in allTodos"
            :key="item.id"
            style="font-size: 14px; list-style-type: none; margin-left: -40px"
          >
            <button
              style="width: 70%; height: 40px"
              class="btn btn-outline-dark"
              v-on:click="getStudentAudio(item.users_id)"
            >
              <div style="overflow: hidden">
                <p style="float: left">{{ item.name }}</p>
                <div v-for="item2 in checkIfStudentFinished" :key="item2.id">
                  <p v-show="item.name === item2.name">&#10004;</p>
                </div>
              </div>
            </button>
          </li>
        </ul>
      </div>
      <div class="item3">
        <!-- <img width="200" height="250" v-for="item in fetchStudentImages" :key="item.student_images_id"
          :src="item.student_image_url" /> -->

        <audio
          controls
          v-for="item in fetchStudentAudio"
          :key="item.student_audios_id"
        >
          <source :src="item.student_audios_url" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },

  computed: mapGetters([
    "allTodos",
    "fetchStudentImages",
    "fetchStudentAudio",
    "checkIfStudentFinished",
  ]),
  created() {
    // this.FetchStudentNames(this.selectedId);
  },
  methods: {
    ...mapActions([
      "FetchStudentNames",
      "FetchStudentImages",
      "FetchStudentAudio",
      "CheckIfStudentFinished",
    ]),
    getStudentFromList: function () {
      let payload = {
        className: this.selectedId,
        unitNumber: (this.selectedUnitNumber = parseInt(
          this.selectedUnitNumber
        )),
      };
      this.FetchStudentNames(payload);
      this.CheckIfStudentFinished(payload);
    },
    getStudentAudio: function (usersID) {
      let payload = { usersID: usersID, unitNumber: this.selectedUnitNumber };
      this.FetchStudentAudio(payload);
    },
  },
  data() {
    return {
      posts: null,
      selectedId: "12D",
      selectedUnitNumber: null,
      testing: null,
    };
  },
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: auto auto auto;
  grid-gap: 10px;
  background-color: #2196f3;
  padding: 10px;
}

.grid-container > div {
  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
  padding: 20px 0;
  /* font-size: 30px; */
}

.item1 {
  grid-column-start: 1;
  grid-column-end: 10;
}

.item2 {
  grid-column-start: 1;
  grid-column-end: 1;
}

.item3 {
  grid-column-start: 2;
  grid-column-end: 10;
}

button:focus {
  background: lightyellow;
}

#dropDownStyle {
  width: 150px;
  margin: 0 auto;
}
</style>