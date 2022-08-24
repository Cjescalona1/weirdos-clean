function collapse(){
var coll = document.getElementsByClassName("collapsible");
var i;
for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}
}

function toggleMuted() {
  var sound = document.getElementById('sound'); 
  var button = document.getElementById('toggleAudio');
  sound.muted = !sound.muted;
  if(sound.muted){
    button.classList.add("unmute")
    button.classList.remove("mute")
  
  }
  else{
    button.classList.add("mute")
    button.classList.remove("unmute")
   
  } 
}

