<template>
    <!-- Default form login -->
    <div class="home">
        <div class="centered">
        </div>
        <div class="centered2">
            <form style="width: 75%; max-width: 700px; margin-left: auto; margin-right: auto;" action="/api/login"
                method="POST">

                <p class="h4 text-center mb-4">Sign in</p>
                <label for="defaultFormLoginEmailEx" class="grey-text">아이디 입력</label>
                <input type="text" id="defaultFormLoginEmailEx" class="form-control" name="username" />
                <br />
                <label for="defaultFormLoginPasswordEx" class="grey-text">비밀번호 입력</label>
                <input type="password" id="defaultFormLoginPasswordEx" class="form-control" name="userpassword" />
                <div class="text-center mt-4">
                    <button class="btn btn-success btn-lg" type="submit">로그인</button>
                </div>
            </form>
        </div>
    </div>
    <!-- Default form login -->
</template>



<script>
    export default {
        data() {
            return {
            }
        },

    }
</script>

<style>
    .home {
        background: url("../assets/PXL_20201008_062744194.NIGHT.jpg") no-repeat center center fixed;
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
        height: 100vh;
    }

    .centered {
        position: fixed;
        top: 50%;
        left: 50%;
        /* bring your own prefixes */
        transform: translate(-50%, -50%);
        background-color: black;
        width: 300px;
        height: 300px;
        opacity: 0.6;
    }

    .centered2 {
        position: fixed;
        color: white;
        top: 50%;
        left: 50%;
        width: 300px;
        /* bring your own prefixes */
        transform: translate(-50%, -50%);
        opacity: 1 !important;
    }
</style>