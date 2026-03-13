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

/* PARTICIPANT ID */

let participant_id = "P" + Math.floor(Math.random()*100000)

jsPsych.data.addProperties({
participant:participant_id
})

/* INTRO */

timeline.push({

type: jsPsychHtmlKeyboardResponse,
stimulus:"<h2>Attention Experiment</h2><p>Press any key to start</p>"

})

/* =========================
CPT TASK
========================= */

let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".replace("X","").split("")

for(let i=0;i<50;i++){

let stim
let type

if(Math.random()<0.8){

stim = letters[Math.floor(Math.random()*letters.length)]
type="GO"

}else{

stim="X"
type="NOGO"

}

timeline.push({

type: jsPsychHtmlKeyboardResponse,

stimulus:`<h1>${stim}</h1>`,

choices:[" "],

trial_duration:500,

data:{
task:"CPT",
stimulus:stim,
trial_type:type
}

})

}

/* =========================
STROOP TASK
========================= */

let colors=["red","blue","green","yellow"]

for(let i=0;i<40;i++){

let word = colors[Math.floor(Math.random()*4)]
let color = colors[Math.floor(Math.random()*4)]

timeline.push({

type: jsPsychHtmlKeyboardResponse,

stimulus:`<h1 style="color:${color}">${word.toUpperCase()}</h1>
<p>LEFT = match color</p>`,

choices:["ArrowLeft","ArrowRight"],

data:{
task:"Stroop",
word:word,
color:color
}

})

}

/* =========================
FLANKER TASK
========================= */

let stimuli=["<<<<<",">>>>>","<<><<",">><>>"]

for(let i=0;i<40;i++){

let stim = stimuli[Math.floor(Math.random()*4)]

timeline.push({

type: jsPsychHtmlKeyboardResponse,

stimulus:`<h1>${stim}</h1>`,

choices:["ArrowLeft","ArrowRight"],

data:{
task:"Flanker",
stimulus:stim
}

})

}

/* END */

timeline.push({

type: jsPsychHtmlKeyboardResponse,

stimulus:"<h2>Thank you</h2>"

})

jsPsych.run(timeline)
