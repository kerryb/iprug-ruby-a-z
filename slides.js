$(document).ready(function(){
  $(document).keydown(function(e) {
    handleKeyDown(e.which);
  });
});

function handleKeyDown(key) {
  if (key === 32) {
    next_slide();
  }
}

function next_slide() {
  next = Math.floor(Math.random() * 6);
  face = ["front", "back", "left", "right", "top", "bottom"][next];
  $("#cube").removeClass().addClass("show-" + face);
}
