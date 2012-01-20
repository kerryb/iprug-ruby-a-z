$(document).ready(function(){
  $(document).keydown(function(e) {
    handleKeyDown(e.which);
  });
  populate_cube();
});

function populate_cube() {
  display_slide("front", 1);
  display_slide("right", 2);
  display_slide("top", 3);
  display_slide("back", 4);
  display_slide("bottom", 5);
  display_slide("left", 6);
  $("#slides").data("number", 1);
  $("#cube").data("face_name", "front");
}

function handleKeyDown(key) {
  if ([32, 13, 39, 40, 74].indexOf(key) > -1) {
    next_slide();
  } else if ([37, 38, 75].indexOf(key) > -1) {
    previous_slide();
  }
}

function next_slide() {
  switch_slide(1);
}

function previous_slide() {
  switch_slide(-1);
}

function switch_slide(offset) {
  var number = $("#slides").data("number") + offset;
  var slide = $("#slide-" + number);
  if (slide.length === 0) { return; }
  var face_name = slide.data("face_name");
  if (!face_name) {
    face_name = random_other_face();
    display_slide(face_name, number);
  }
  $("#cube").removeClass().addClass("show-" + face_name);
  $("#slides").data("number", number);
  $("#cube").data("face_name", face_name);
}

function random_other_face() {
  not_this = function(f) { return f !== $("#cube").data("face_name") }
  var next = Math.floor(Math.random() * 5);
  return ["front", "back", "left", "right", "top", "bottom"].filter(not_this)[next];
}

function h2d(h) {
  return parseInt(h,16);
}

function display_slide(face_name, number) {
  var slide = $("#slide-" + number);
  var face = $("#cube ." + face_name);
  slide.data("face_name", face_name);
  face.html(slide.html());

  var bg = slide.attr("data-background");
  var fg = slide.attr("data-foreground");
  face.css("background-color", "#" + bg);
  face.css("color", "#" + fg);

  if (slide.attr("data-inset") === "shadow") {
    var bg_rgb = new RGBColour(h2d(bg.substr(0, 2)), h2d(bg.substr(2, 2)), h2d(bg.substr(4, 2)));
    var bg_hsl = bg_rgb.getHSL();
    var shadow_hsl = new HSLColour(bg_hsl.h, bg_hsl.s, bg_hsl.l / 2);
    face.css("text-shadow", shadow_hsl.getCSSHexadecimalRGB() + " -1px -1px 0");
  } else {
    face.children("h1").css("text-shadow", "white 1px 1px 0");
  }
}
