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

/* ====================
CPT TASK
==================== */

let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".replace("X","").split("")

for(let i=0;i<50;i++){

let stimulus
let type

if(Math.random()<0.8){
stimulus = letters[Math.floor(Math.random()*letters.length)]
type="GO"
}
else{
stimulus="X"
type="NOGO"
}

timeline.push({

type: jsPsychHtmlKeyboardResponse,

stimulus:`<h1>${stimulus}</h1>`,

choices:[" "],

trial_duration:500,

data:{
task:"CPT",
stimulus:stimulus,
trial_type:type
}

})

}

/* ====================
STROOP TASK
==================== */

let colors=["red","blue","green","yellow"]

for(let i=0;i<40;i++){

let word = colors[Math.floor(Math.random()*4)]
let color = colors[Math.floor(Math.random()*4)]

let trial_type = (word==color) ? "congruent" : "incongruent"

timeline.push({

type: jsPsychHtmlKeyboardResponse,

stimulus:`<h1 style="color:${color}">${word.toUpperCase()}</h1>`,

choices:["ArrowLeft","ArrowRight"],

data:{
task:"Stroop",
word:word,
color:color,
trial_type:trial_type
}

})

}

/* ====================
FLANKER TASK
==================== */

let stimuli = [
{stim:"<<<<<",type:"congruent"},
{stim:">>>>>",type:"congruent"},
{stim:"<<><<",type:"incongruent"},
{stim:">><>>",type:"incongruent"}
]

for(let i=0;i<40;i++){

let trial = stimuli[Math.floor(Math.random()*4)]

timeline.push({

type: jsPsychHtmlKeyboardResponse,

stimulus:`<h1>${trial.stim}</h1>`,

choices:["ArrowLeft","ArrowRight"],

data:{
task:"Flanker",
stimulus:trial.stim,
trial_type:trial.type
}

})

}

/* END */

timeline.push({

type: jsPsychHtmlKeyboardResponse,
stimulus:"<h2>Thank you for participating</h2>"

})

jsPsych.run(timeline)
