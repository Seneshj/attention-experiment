const jsPsych = initJsPsych({
    on_finish: function() {

        const data = jsPsych.data.get().csv()

        fetch("save_data.php", {
            method: "POST",
            body: data
        })
    }
})

let timeline = []

/* ==========================
PARTICIPANT ID
========================== */

let participant_id = Math.floor(Math.random()*100000)

jsPsych.data.addProperties({
    participant: participant_id
})

/* ==========================
INSTRUCTIONS
========================== */

timeline.push({
type: jsPsychHtmlKeyboardResponse,
stimulus: "<h2>Attention Experiment</h2><p>Press any key to start</p>"
})

/* ==========================
TASK 1 — CPT
========================== */

let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".replace("X","").split("")

let cpt_trials = []

for(let i=0;i<50;i++){

let stimulus
let type

if(Math.random()<0.8){
stimulus = letters[Math.floor(Math.random()*letters.length)]
type="GO"
}else{
stimulus="X"
type="NOGO"
}

cpt_trials.push({
type: jsPsychHtmlKeyboardResponse,
stimulus: `<h1>${stimulus}</h1>`,
choices:[" "],
trial_duration:500,
data:{
task:"CPT",
stimulus:stimulus,
trial_type:type
}
})

}

timeline = timeline.concat(cpt_trials)

/* ==========================
TASK 2 — STROOP
========================== */

let colors=["RED","BLUE","GREEN","YELLOW"]

for(let i=0;i<40;i++){

let word = colors[Math.floor(Math.random()*4)]
let color = colors[Math.floor(Math.random()*4)]

timeline.push({
type: jsPsychHtmlKeyboardResponse,
stimulus:`<h1 style="color:${color}">${word}</h1>
<p>LEFT = match color</p>`,
choices:["ArrowLeft","ArrowRight"],
data:{
task:"Stroop",
word:word,
color:color
}
})

}

/* ==========================
TASK 3 — FLANKER
========================== */

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

/* ==========================
END SCREEN
========================== */

timeline.push({
type: jsPsychHtmlKeyboardResponse,
stimulus:"<h2>Thank you</h2>"
})

jsPsych.run(timeline)