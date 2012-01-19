$(document).ready(function(){
  $(document).keydown(function(e) {
    handleKeyDown(e.which);
  });
  display_slide("front", 1);
});

function handleKeyDown(key) {
  if (key === 32) {
    next_slide();
  }
}

function next_slide() {
  var next = Math.floor(Math.random() * 6);
  var face = ["front", "back", "left", "right", "top", "bottom"][next];
  display_slide(face, 1);
  $("#cube").removeClass().addClass("show-" + face);
}

function display_slide(face, number) {
  var slide = $("#slide-" + number);
  var face = $("#cube ." + face);
  face.html(slide.html());
  face.css("background-color", "#" + slide.attr("data-background"));
  face.css("color", "#" + slide.attr("data-foreground"));
  face.css("text-shadow", "black -1px -1px 0");
}
