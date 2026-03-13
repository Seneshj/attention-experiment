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

let participant = "P" + Math.floor(Math.random()*100000)

jsPsych.data.addProperties({
participant_id:participant
})
timeline.push({

type: jsPsychHtmlButtonResponse,

stimulus:`
<h2>Attention Experiment</h2>
<p>This study contains 3 tasks</p>
<p>CPT • Stroop • Flanker</p>
`,

choices:["Start"]

})
const TOTAL_TRIALS = 50
const TARGET_PROBABILITY = 0.8
const STIMULUS_DURATION = 500
const INTERVAL = 1000

let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".replace("X","").split("")

for(let i=0;i<TOTAL_TRIALS;i++){

let stim
let type

if(Math.random() < TARGET_PROBABILITY){
stim = letters[Math.floor(Math.random()*letters.length)]
type="GO"
}else{
stim="X"
type="NOGO"
}

timeline.push({

type: jsPsychHtmlButtonResponse,

stimulus:`<h1 style="font-size:80px">${stim}</h1>`,

choices:["Tap"],

trial_duration: STIMULUS_DURATION,

data:{
task:"CPT",
stimulus:stim,
trial_type:type
}

})

timeline.push({
type: jsPsychHtmlKeyboardResponse,
stimulus:"",
choices:"NO_KEYS",
trial_duration:INTERVAL
})

}

}
let stroop_start

timeline.push({
type: jsPsychCallFunction,
func:()=>{stroop_start = performance.now()}
})

let colors=["RED","BLUE","GREEN","YELLOW"]

let stroop_trial={

type: jsPsychHtmlButtonResponse,

stimulus:function(){

let word = colors[Math.floor(Math.random()*4)]
let color = colors[Math.floor(Math.random()*4)]

jsPsych.data.addProperties({
word:word,
color:color
})

return `<h1 style="color:${color.toLowerCase()}">${word}</h1>`

},

choices:["YELLOW","GREEN"],

button_html:`
<button style="font-size:30px;width:200px;height:80px;margin:20px;">
%choice%
</button>
`,

data:{task:"Stroop"}

}

timeline.push({

timeline:[stroop_trial],

loop_function:function(){

return (performance.now()-stroop_start)<90000

}

})
let flanker_start

timeline.push({
type: jsPsychCallFunction,
func:()=>{flanker_start = performance.now()}
})

let stimuli=[

{stim:"<<<<<",correct:0,type:"congruent"},
{stim:">>>>>",correct:1,type:"congruent"},
{stim:"<<><<",correct:1,type:"incongruent"},
{stim:">><>>",correct:0,type:"incongruent"}

]

let flanker_trial={

type: jsPsychHtmlButtonResponse,

stimulus:function(){

let trial=stimuli[Math.floor(Math.random()*4)]

jsPsych.data.addProperties(trial)

return `<h1>${trial.stim}</h1>`

},

choices:["⬅️","➡️"],

button_html:`
<button style="font-size:40px;width:120px;height:80px;margin:30px;">
%choice%
</button>
`,

data:{task:"Flanker"}

}

timeline.push({

timeline:[flanker_trial],

loop_function:function(){

return (performance.now()-flanker_start)<90000

}

})
timeline.push({

type: jsPsychHtmlButtonResponse,

stimulus:"<h2>Thank you for participating</h2>",

choices:["Finish"]

})
jsPsych.run(timeline)
