<template>
    <div class="vue-tempalte">
        <!-- <form ref='uploadForm' action="http://localhost/api/studentUploadImages" method="POST"
            encType="multipart/form-data">
            <label for="myfile">Select a file:</label>
            <input type="file" id="myfile" name="myfile" multiple="multiple"><br><br>
            <input type="submit" value="upload" />
        </form> -->


        <div class="grid-container">
            <div class="item1">
                <label>Select Class Name</label>
                <select class="form-control" v-model="selectedValue" name="cars" id="dropDownStyle"
                    @change="changeSelectedWeek" style="width:30%;">
                    <option value="1" disabled>Choose One</option>
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
                <br />
                <fieldset :disabled="isFormDisabled">
                    <legend visible="true" style="width:auto; margin-left: 20px;">
                        {{selectedValue}} </legend>

                    <div>
                        <!-- <form class="form-group" ref='uploadForm' action="http://localhost/api/studentUploadAudio?id=1"
                            method="POST" encType="multipart/form-data"> -->
                        <form class="form-group" ref='uploadForm' action="/api/studentUploadAudio/" method="POST"
                            encType="multipart/form-data">
                            <label for="myfile">Select a file: </label>
                            <input type="hidden" name="selectedValue" v-model="selectedValue"
                                class="form-control form-control-lg" />
                            <input @change="userSelectedFile" class="form-control-file" type="file" id="myfile"
                                name="myfile" accept="mp3/m4a"><br><br>
                            <input :disabled="!wasFileSelected" type="submit" value="업로드" />
                        </form>


                        <!-- <div v-if="item.unit_number === 1">
                            <audio controls>
                                <source :src="item.student_audios_url" type="audio/mpeg">
                                Your browser does not support the audio element.
                            </audio>
                            <button v-on:click="deleteStudentAudio(item.student_audios_url, item.student_audios_id)"
                                type="button" class="btn btn-danger">Delete</button>
                        </div> -->
                    </div>

                </fieldset>
            </div>
        </div>
    </div>


</template>



<script>
    import { mapGetters, mapActions } from "vuex";
    import jwt_decode from "jwt-decode";
    import axios from "axios";
    export default {
        name: "HelloWorld",
        props: {
            msg: String,
        },

        computed: mapGetters(["fetchStudentAudioForStudentPage"]),
        created() {
            let token = document.cookie;
            var decodedHeader = jwt_decode(token);
            let payload = { 'usersID': decodedHeader.id }
            this.FetchStudentAudioForStudentPage(payload);
        },
        methods: {
            ...mapActions(["FetchStudentAudioForStudentPage"]),

            deleteStudentAudio: async (fileName, audioID) => {
                let getFileName = fileName.match(/[^/]+$/g);
                axios.defaults.withCredentials = true;
                console.log("Deleted")
                await axios.post("/api/deleteAudioFile", {
                    filename: getFileName,
                    audioID: audioID,
                    /* more parameters here */
                }).then(
                    location.reload()
                );
            },

            changeSelectedWeek: function () {
                this.currentWeek = this.selectedValue;
                this.isFormDisabled = false;
            },

            userSelectedFile: function () {
                this.wasFileSelected = true;
            },
        },
        data() {
            return {
                posts: null,
                selectedValue: "",
                selectedUnitNumber: null,
                studentAudios: null,
                currentWeek: null,
                isFormDisabled: true,
                wasFileSelected: false,
            };
        },
    };
</script>

<style>
    .grid-container {
        display: grid;
        grid-template-columns: auto auto auto;
        grid-gap: 10px;
        /* background-color: #2196f3; */
        padding: 10px;
    }

    .grid-container>div {
        /* background-color: rgba(255, 255, 255, 0.8); */
        /* text-align: center; */
        padding: 20px 0;
        /* font-size: 30px; */
    }

    .item1 {
        grid-column-start: 1;
        grid-column-end: 10;
        width: 90%;
        margin: 0 auto;
    }

    .item2 {
        grid-column-start: 1;
        grid-column-end: 1;
    }

    .item3 {
        grid-column-start: 2;
        grid-column-end: 10;
    }

    button:hover {
        background: yellow;
    }

    fieldset {
        border: 2px solid #000;
    }
</style>