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

let participant_id = "P" + Math.floor(Math.random()*100000)

jsPsych.data.addProperties({
participant:participant_id
})
timeline.push({

type: jsPsychHtmlButtonResponse,

stimulus:`
<h2>Attention Experiment</h2>
<p>This experiment has 3 tasks</p>
<p>CPT • Stroop • Flanker</p>
`,

choices:["Start Experiment"]

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

stimulus:`<h1>${stim}</h1>`,

choices:["Tap"],

trial_duration: STIMULUS_DURATION,

data:{
task:"CPT",
stimulus:stim,
trial_type:type
}

})

timeline.push({

type: jsPsychHtmlButtonResponse,

stimulus:"",
choices:[],

trial_duration: INTERVAL

})

}
let colors=["RED","BLUE","GREEN","YELLOW"]
let stroop_start
timeline.push({

type: jsPsychCallFunction,

func:function(){
stroop_start = performance.now()
}

})
let stroop_trial = {

type: jsPsychHtmlButtonResponse,

stimulus:function(){

let word = colors[Math.floor(Math.random()*4)]
let color = colors[Math.floor(Math.random()*4)]

jsPsych.data.addProperties({
word:word,
color:color
})

return `
<div>

<h1 style="color:${color.toLowerCase()}">${word}</h1>

</div>
`

},

choices:["YELLOW","GREEN"],

button_html:`
<button style="font-size:30px;width:200px;height:80px;margin:30px;">
%choice%
</button>
`,

on_finish:function(data){

data.task="Stroop"

if(data.response==0 && data.color=="YELLOW") data.accuracy=1
else if(data.response==1 && data.color=="GREEN") data.accuracy=1
else data.accuracy=0

}

}
timeline.push({

timeline:[stroop_trial],

loop_function:function(){

let elapsed = performance.now() - stroop_start

return elapsed < 90000

}

})
let flanker_start

let stimuli=[

{stim:"<<<<<",correct:0,type:"congruent"},
{stim:">>>>>",correct:1,type:"congruent"},
{stim:"<<><<",correct:1,type:"incongruent"},
{stim:">><>>",correct:0,type:"incongruent"}

]
timeline.push({

type: jsPsychCallFunction,

func:function(){
flanker_start = performance.now()
}

})
let flanker_trial={

type: jsPsychHtmlButtonResponse,

stimulus:function(){

let trial = stimuli[Math.floor(Math.random()*4)]

jsPsych.data.addProperties({
stimulus:trial.stim,
correct:trial.correct,
trial_type:trial.type
})

return `<h1>${trial.stim}</h1>`

},

choices:["⬅️","➡️"],

button_html:`
<button style="font-size:40px;width:120px;height:80px;margin:40px;">
%choice%
</button>
`,

on_finish:function(data){

data.task="Flanker"

data.accuracy = (data.response==data.correct)?1:0

}

}
timeline.push({

timeline:[flanker_trial],

loop_function:function(){

let elapsed = performance.now() - flanker_start

return elapsed < 90000

}

})
timeline.push({

type: jsPsychHtmlButtonResponse,

stimulus:"<h2>Experiment Complete</h2>",

choices:["Finish"]

})
jsPsych.run(timeline)
