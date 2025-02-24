

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
    "objects_videos/object1/1A.mp4",
    "objects_videos/object1/1B.mp4",
    "objects_videos/object1/1C.mp4",
    "objects_videos/object1/1D.mp4"
  ],
  "object2": [
    "objects_videos/object2/2A.mp4",
    "objects_videos/object2/2B.mp4",
    "objects_videos/object2/2C.mp4",
    "objects_videos/object2/2D.mp4",
    "objects_videos/object2/2E.mp4",
    "objects_videos/object2/2F.mp4"
  ],
  "object3": [
    "objects_videos/object3/3A.mp4",
    "objects_videos/object3/3B.mp4",
    "objects_videos/object3/3C.mp4",
    "objects_videos/object3/3D.mp4",
    "objects_videos/object3/3E.mp4"
  ],
  "object4": [
    "objects_videos/object4/4A.mp4",
    "objects_videos/object4/4B.mp4",
    "objects_videos/object4/4C.mp4",
    "objects_videos/object4/4D.mp4",
    "objects_videos/object4/4E.mp4"
  ],
  "object5": [
    "objects_videos/object5/5A.mp4",
    "objects_videos/object5/5B.mp4",
    "objects_videos/object5/5C.mp4",
    "objects_videos/object5/5D.mp4"
  ],
  "object6": [
    "objects_videos/object6/6A.mp4",
    "objects_videos/object6/6B.mp4",
    "objects_videos/object6/6C.mp4",
    "objects_videos/object6/6D.mp4",
    "objects_videos/object6/6E.mp4",
    "objects_videos/object6/6F.mp4"
  ],
  "object7": [
    "objects_videos/object7/7A.mp4",
    "objects_videos/object7/7B.mp4",
    "objects_videos/object7/7C.mp4",
    "objects_videos/object7/7D.mp4",
    "objects_videos/object7/7E.mp4"
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
// Shuffle the pairs
  // video_pairs = video_pairs.sort(() => Math.random() - 0.5);
  // more than 70 pairs

  console.log("video_pair length")
  console.log(video_pairs.length)
  console.log(video_pairs)
  
// Add a function to log data
function logExpData(trial) {
    return new Promise((resolve, reject) => {
        const data = {
            trial_type: trial.trial_type,
            stimulus: trial.stimulus,
            response: trial.response,
            rt: trial.rt,
            similarity_rating: trial.similarity_rating,
            object1: trial.stimulus.match(/object\d+/)[0],
            object2: trial.stimulus.match(/object\d+/)[1],
        }})}
  
var trial1 = {
          type: jsPsychInstructions,
          pages: [
              '<div style="text-align: center; margin: 50px;"><img src="stanford.png"></div>' +
              '<div style="text-align: center; margin: 0 auto; max-width: 600px; font-size: 18px;">' +
              '<p>By answering the following questions, you are participating in a study being performed by cognitive scientists in the Stanford Department of Psychology.</p>' +
              '<p>If you have questions about this research, please contact us at <a href="mailto:languagecoglab@gmail.com">languagecoglab@gmail.com</a>.</p>' +
              '<p>You must be at least 18 years old to participate. Your participation in this research is voluntary.</p>' +
              '<p>You may decline to answer any or all of the following questions. You may decline further participation, at any time, without adverse consequences.</p>' +
              '<p>Your anonymity is assured.</p>' +
              '<p> Click next to begin.</p>' +
              '</div>'
          ],
          show_clickable_nav: true,
          button_label: 'Next', // Customize the button label
          button_html: '<button class="jspsych-btn" style="font-size: 30px; padding: 10px 20px;">%choice%</button>' // Customize the button style
      };
      
      
timeline.push(trial1)

// Add instructions at the beginning
var instructions = {
  type: jsPsychInstructions,
  pages: [
      '<div style="text-align: center; margin: 50px;"><img src="stanford.png"></div>' +
      '<div style="text-align: center; margin: 0 auto; max-width: 600px; font-size: 30px;">' +
      '<p> <b>Welcome to our study. </b> </p>' +
      '<p> In this study, you will see pairs of objects and be asked to rate how similar they are. </p>' +
      '<p> Please click next to start the experiment ...  </p>' +
      '</div>'
  ],
  show_clickable_nav: true,
};
  show_page_number: false,
timeline.push(instructions);

//Create jsPsych trials
const trials = video_pairs.map(pair => ({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="display: flex; justify-content: center; gap: 20px;">
      <video id="vid1" class="video-fix" width="300" height="300" autoplay muted>
        <source src="${pair[0]}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <video id="vid2" class="video-fix" width="300" height="300" autoplay muted>
        <source src="${pair[1]}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>
    <p>How similar are these objects?</p>`,
  choices: ['1 - Not similar', '2', '3', '4', '5 - Very similar'],
  on_load: function() {
    // Disable buttons at the start
    document.querySelectorAll(".jspsych-btn").forEach(btn => btn.disabled = true);

    const vid1 = document.getElementById("vid1");
    const vid2 = document.getElementById("vid2");

    // Ensure both videos start playing simultaneously
    function playVideos() {
      vid1.play();
      vid2.play();
    }

    vid1.oncanplay = playVideos;
    vid2.oncanplay = playVideos;

    // Enable buttons only after both videos finish
    function enableButtons() {
      if (vid1.ended && vid2.ended) {
        document.querySelectorAll(".jspsych-btn").forEach(btn => btn.disabled = false);
      }
    }

    vid1.onended = enableButtons;
    vid2.onended = enableButtons;
  }
}));

trials.sort(() => Math.random() - 0.5);

timeline.push(...trials);



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
