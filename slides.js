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

function h2d(h) {
  return parseInt(h,16);
}

function display_slide(face, number) {
  var slide = $("#slide-" + number);
  var face = $("#cube ." + face);
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
