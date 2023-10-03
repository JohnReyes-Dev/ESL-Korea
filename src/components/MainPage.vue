<template>
  <div class="hello">
    <div class="grid-container">

      <div class="input-group md-form form-sm form-1 pl-0">
        <div class="input-group-prepend">
          <span class="input-group-text purple lighten-3" id="basic-text1">
            <i class="fas fa-search text-white" aria-hidden="true"></i>
          </span>
        </div>
        <input class="form-control my-0 py-1" type="text" placeholder="Search" aria-label="Search" />
      </div>


      <!-- <div v-for="item in allTodos" :key="item.id"
        style="height: 246px; width: 790px; margin:0 auto; margin-top: 15px; ">

        <input type="checkbox" :id="item.id" name="vehicle1" value="item.id">

        <div style="background-color:#aeddf5; border-top-left-radius: 5px; border-top-right-radius: 5px;">
          <p style="margin-left: 25px; font-size: 24px;">Teach in my School</p>

          <div style="margin-left: 25px; margin-top: -5px; overflow: hidden; ">
            <p style="float: left; font-size: 16px;">{{item.id}} {{item.schoolname}}</p>
            <p style="margin-left: 10px; float: left; font-size: 16px;">| {{item.schoollocation}}</p>
          </div>
        </div>
        <div style="background-color: #d5edf9; height: 152px;">
          <div style="margin-left: 25px; overflow: hidden; ">
            <p style="float: left; font-size: 16px;">{{fullPartContract}}</p>
            <p style="margin-left: 10px; float: left; font-size: 16px;">| {{postedDate}}</p>
          </div>
          <p style="margin-left: 25px; margin-right: 10px;">{{item.schooldescription}}</p>
          <p style="margin-left: 25px;">Starting Date: {{startingDate}}</p>
        </div>
      </div> -->

    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  export default {
    name: "HelloWorld",
    props: {
      msg: String,
    },

    // mounted: function () {
    //   this.$axios.get('http://localhost:5000/get')
    //     .then(response => this.posts = response.data);
    // },
    computed: mapGetters(['allTodos']),
    created() {
      this.fetchTodos();
    },
    methods: {
      ...mapActions(['fetchTodos', "deleteTodo"]),
    },

    data() {
      return {
        posts: null,
        companyName: "Bucheon International School",
        location: "Bucheon",
        fullPartContract: "Full Time",
        postedDate: "1 day ago",
        description:
          "Working hours: 7:30 am ~ 4:30 pm  Teaching hours: less than 24 hours per week Benefits: Paid vacation, Medical insurance, Pension, Lunch, Severance, Housing allowance ",
        startingDate: "ASAP",
      };
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
} */
</style>