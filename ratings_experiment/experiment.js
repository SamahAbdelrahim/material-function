

var jsPsych = initJsPsych({
    use_webaudio: false,
    on_finish: function(data){
        console.log("starting")
        jsPsych.data.displayData();
    
        var all_trials = jsPsych.data.get().values();
        console.log("Starting to log data");
        console.log(all_trials)
        all_trials.forEach(trial => {
             //logExpData(trial);
             console.log("one trial");
             console.log(trial);

         });

        Promise.all(all_trials.map(trial => logExpData(trial)))
            .then(() => {
                console.log("All data logged, redirecting...");
                //window.location.href = "https://app.prolific.com/submissions/complete?cc=C1O4GW39";
            })
            .catch(error => {
                console.error("Failed to log all data", error);
                alert("There was an error saving your data. Please contact the study administrator.");
            });
    }
}); 


let timeline = [];

const object_sets = {
  "object1": [
    "object1/1A.mp4",
    "object1/1B.mp4",
    "object1/1C.mp4",
    "object1/1D.mp4"
  ],
  "object2": [
    "object2/2A.mp4",
    "object2/2B.mp4",
    "object2/2C.mp4",
    "object2/2D.mp4",
    "object2/2E.mp4",
    "object2/2F.mp4"
  ],
  "object3": [
    "object3/3A.mp4",
    "object3/3B.mp4",
    "object3/3C.mp4",
    "object3/3D.mp4",
    "object3/3E.mp4"
  ],
  "object4": [
    "object4/4A.mp4",
    "object4/4B.mp4",
    "object4/4C.mp4",
    "object4/4D.mp4",
    "object4/4E.mp4"
  ],
  "object5": [
    "object5/5A.mp4",
    "object5/5B.mp4",
    "object5/5C.mp4",
    "object5/5D.mp4"
  ],
  "object6": [
    "object6/6A.mp4",
    "object6/6B.mp4",
    "object6/6C.mp4",
    "object6/6D.mp4",
    "object6/6E.mp4",
    "object6/6F.mp4"
  ],
  "object7": [
    "object7/7A.mp4",
    "object7/7B.mp4",
    "object7/7C.mp4",
    "object7/7D.mp4",
    "object7/7E.mp4"
  ]
}
  
  // Function to generate all unique pairs within a folder
  function generatePairs(videos) {
    let pairs = [];
    for (let i = 0; i < videos.length; i++) {
      for (let j = i + 1; j < videos.length; j++) {
        pairs.push([videos[i], videos[j]]);
      }
    }
    return pairs;
  }
  
  // Generate pairs for all object sets
  let video_pairs = [];
  for (let object in object_sets) {
    video_pairs = video_pairs.concat(generatePairs(object_sets[object]));
  }

  console.log("video_pair")

  console.log(video_pairs)
  


var goodbye = {
    type: jsPsychInstructions,
    pages: [
        '<div style="text-align: center; margin: 50px;"><img src="stanford.png"></div>' +
        '<div style="text-align: center; margin: 0 auto; max-width: 600px; font-size: 30px;">' +
        '<p> <b>Thank you for your participation and we appreciate you helping science. </b> </p>' +
        '<p> please click next to get redirected ...  </p>' +
        '</div>'
    ],
    show_clickable_nav: true,

};

timeline.push(goodbye);


jsPsych.run(timeline);






// https://github.com/levante-framework/core-tasks/blob/main/task-launcher/src/tasks/math/trials/sliderStimulus.js
