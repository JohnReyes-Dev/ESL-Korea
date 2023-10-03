<template>
    <form style="width: 75%; max-width: 700px; margin-left: auto; margin-right: auto;"
        action="http://localhost:5000/testingForm" method="POST">

        <label style="float: left">School Name *</label>
        <br />
        <br />
        <div class="form-row" style="margin-top: -12px;">
            <div class="form-group col-md-12">
                <input type="text" name="schoolName" class="form-control" placeholder="School Name" />
            </div>
        </div>
        <br />
        <label style="float: left">School Location *</label>
        <br />
        <br />

        <div class="form-row" style="margin-top: -12px;">
            <div class="form-group col-md-12">
                <input type="text" name="schoolLocation" class="form-control" placeholder="School Location" />
            </div>
        </div>


        <br />
        <div class="form-group">
            <label style="float: left">Email Adress *</label>
            <input type="email" name="schoolEmail" class="form-control" placeholder="Example@gmail.com" />
        </div>
        <br />
        <div class="form-group">
            <label style="float: left;">School Description *</label>
            <textarea ref="input" name="schoolDescription" class="form-control" rows="8"></textarea>
        </div>

        <button type="submit" class="submit-button btn btn-primary">Submit</button>

    </form>
</template>

<script>
    module.exports = {
        data: function () {
            return {
                greeting: "Hello"
            };
        }
    };
</script>

<style scoped>
    p {
        font-size: 2em;
        text-align: center;
    }
</style>