<template>
    <div class="vue-tempalte">
        <form action="/api/registerbyfile" method="POST">

            <h3>Sign Up</h3>

            <div class="form-group">
                <label>Full Name</label>
                <input type="text" name="name" class="form-control form-control-lg" />
            </div>

            <div class="form-group">
                <label>username</label>
                <input type="text" name="username" class="form-control form-control-lg" />
            </div>

            <div class="form-group">
                <label>Password</label>
                <input type="password" name="userpassword" class="form-control form-control-lg" />
            </div>

            <button type="submit" class="btn btn-dark btn-lg btn-block">Sign Up</button>

            <p class="forgot-password text-right">
                Already registered
                <router-link :to="{name: 'login'}">sign in?</router-link>
            </p>
        </form>

        <form ref='uploadForm' action="/api/registerbyfile" method="POST" encType="multipart/form-data">

            <label for="myfile">Select a file:</label>
            <input type="file" id="myfile" name="myfile"><br><br>
            <input type="submit" value="upload" />
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // ur: 
            }
        }
    }
</script>