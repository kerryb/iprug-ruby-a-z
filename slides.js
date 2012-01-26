$(document).ready(function(){
  Presentation.init();
});

var Presentation = {
  current_slide: 1,

  init: function() {
    $(document).keydown(function(e) {
      Presentation.handleKeyDown(e.which);
    });
    this.populate_cube();
    this.show_initial_slide();
  },

  populate_cube: function() {
    this.display_slide("front", 1);
    this.display_slide("right", 2);
    this.display_slide("top", 3);
    this.display_slide("back", 4);
    this.display_slide("bottom", 5);
    this.display_slide("left", 6);
  },

  show_initial_slide: function() {
    if (location.hash === "") {
      this.go_to_slide(1);
    } else {
      this.go_to_slide(parseInt(location.hash.substr(1), 10));
    }
  },

  handleKeyDown: function(key) {
    if ([32, 13, 39, 40, 74].indexOf(key) > -1) {
      this.next_slide();
    } else if ([37, 38, 75].indexOf(key) > -1) {
      this.previous_slide();
    }
  },

  next_slide: function() {
    this.go_to_slide(this.current_slide + 1);
  },

  previous_slide: function() {
    this.go_to_slide(this.current_slide - 1);
  },

  go_to_slide: function(number) {
    var slide = $("#slide-" + number);
    if (slide.length !== 0) {
      var face_name = slide.data("face_name");
      if (!face_name) {
        face_name = random_other_face();
        this.display_slide(face_name, number);
      }
      $("#cube").removeClass().addClass("show-" + face_name);
      this.current_slide = number;
      $("#cube").data("face_name", face_name);
      location.hash = number;
    }
  },

  random_other_face: function() {
    not_this = function(f) { return f !== $("#cube").data("face_name"); };
    var next = Math.floor(Math.random() * 5);
    return ["front", "back", "left", "right", "top", "bottom"].filter(not_this)[next];
  },

  display_slide: function(face_name, number) {
    function h2d(h) {
      return parseInt(h,16);
    }

    var slide = $("#slide-" + number);
    var face = $("#cube ." + face_name);
    var old_slide = $("#slide-" + face.data("slide"));
    old_slide.removeData("face_name");
    slide.data("face_name", face_name);
    face.data("slide", number);
    face.html(slide.html());

    var bg = slide.attr("data-background");
    var fg = slide.attr("data-foreground");
    var image = slide.attr("data-image");
    face.css("background-color", "#" + bg);
    face.css("color", "#" + fg);
    if (image) {
      face.css("background-image", "url('images/" + image + ".png')");
    }

    if (slide.attr("data-inset") === "shadow") {
      var bg_rgb = new RGBColour(h2d(bg.substr(0, 2)), h2d(bg.substr(2, 2)), h2d(bg.substr(4, 2)));
      var bg_hsl = bg_rgb.getHSL();
      var shadow_hsl = new HSLColour(bg_hsl.h, bg_hsl.s, bg_hsl.l / 2);
      face.css("text-shadow", shadow_hsl.getCSSHexadecimalRGB() + " -1px -1px 0");
    } else {
      face.children("h1").css("text-shadow", "white 1px 1px 0");
    }
  }
};
