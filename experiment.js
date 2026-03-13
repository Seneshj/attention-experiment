const jsPsych = initJsPsych({

on_finish:function(){

let data = jsPsych.data.get().csv()

fetch("save_data.php",{
method:"POST",
body:data
})

}

})

let timeline = []
