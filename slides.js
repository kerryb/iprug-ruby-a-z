$(document).ready(function(){
  Presentation.init();
});

var Presentation = {
  current_slide: 1,
  current_face: "front",
  faces: [
    {name: "front", slide: 1},
    {name: "right", slide: 2},
    {name: "top", slide: 3},
    {name: "back", slide: 4},
    {name: "bottom", slide: 5},
    {name: "left", slide: 6}
  ],


  init: function() {
    $(document).keydown(function(e) {
      Presentation.handleKeyDown(e.which);
    });
    this.populate_cube();
    this.show_initial_slide();
  },

  populate_cube: function() {
    this.faces.forEach(function(face) { Presentation.display_slide(face.name, face.slide); });
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

  slide_element: function(number) { return $("#slide-" + number); },
  face_element: function(name) { return $("#cube ." + name); },

  go_to_slide: function(number) {
    var slide = this.slide_element(number);
    if (slide.length !== 0) {
      var face = this.faces.filter(function(f) { return f.slide === number; })[0];
      var face_name;
      if (face) {
        face_name = face.name;
      } else {
        face_name = this.random_other_face();
        this.display_slide(face_name, number);
      }
      $("#cube").removeClass().addClass("show-" + face_name);
      this.current_slide = number;
      this.current_face = face_name;
      location.hash = number;
    }
  },

  random_other_face: function() {
    function not_this(f) { return f !== this.current_face; }

    var next = Math.floor(Math.random() * 5);
    return ["front", "back", "left", "right", "top", "bottom"].filter(not_this)[next];
  },

  display_slide: function(face_name, number) {
    function h2d(h) {
      return parseInt(h,16);
    }

    var slide = this.slide_element(number);
    var face = this.face_element(face_name);
    this.faces.filter(function(f) { return f.name === face_name; })[0].slide = number;
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
