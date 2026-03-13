function compute_features(data){

let cpt = data.filter(d => d.task=="CPT")
let stroop = data.filter(d => d.task=="Stroop")
let flanker = data.filter(d => d.task=="Flanker")

function avg(arr){
return arr.reduce((a,b)=>a+b,0)/arr.length
}

/* CPT */

let cpt_rt = cpt.filter(d=>d.rt).map(d=>d.rt)

let cpt_mean_rt = avg(cpt_rt)

/* Stroop */

let congruent = stroop.filter(d=>d.trial_type=="congruent").map(d=>d.rt)
let incongruent = stroop.filter(d=>d.trial_type=="incongruent").map(d=>d.rt)

let stroop_interference = avg(incongruent)-avg(congruent)

/* Flanker */

let fcon = flanker.filter(d=>d.trial_type=="congruent").map(d=>d.rt)
let finc = flanker.filter(d=>d.trial_type=="incongruent").map(d=>d.rt)

let flanker_interference = avg(finc)-avg(fcon)

return {

cpt_mean_rt:cpt_mean_rt,
stroop_interference:stroop_interference,
flanker_interference:flanker_interference

}

}
