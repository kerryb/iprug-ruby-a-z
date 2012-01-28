$(document).ready(function(){
  Presentation.init();
});

var Presentation = {
  slides: [
    {background: "ffff00", foreground: "0000ff", inset: "highlight", content: "#title-slide"},
    {background: "6d7542", foreground: "d7608e", inset: "shadow", letter: "A", image: "activesupport"},
    {foreground: "ff0000", inset: "shadow", letter: "B", image: "blocks"},
    {foreground: "ffff00", inset: "shadow", letter: "C", image: "community"},
    {foreground: "ff00ff", inset: "shadow", letter: "D", image: "duck_typing"},
    {foreground: "ff00ff", inset: "shadow", letter: "E"}
  ],

  current_slide: 0,
  current_face: "front",

  cube: {
    faces: [
      {name: "front", slide: 0},
      {name: "right", slide: 1},
      {name: "top", slide: 2},
      {name: "back", slide: 3},
      {name: "bottom", slide: 4},
      {name: "left", slide: 5}
    ],
    face_with_slide: function(number) {
      return this.faces.filter(function(f) { return f.slide === number; })[0];
    },
    face_named: function(name) {
      return this.faces.filter(function(f) { return f.name === name; })[0];
    },
    populate: function() {
      return this.faces.forEach(function(face) { Presentation.display_slide(face.name, face.slide); });
    }
  },

  init: function() {
    $(document).keydown(function(e) {
      Presentation.handleKeyDown(e.which);
    });
    this.cube.populate();
    this.show_initial_slide();
  },

  show_initial_slide: function() {
    if (location.hash === "") {
      this.go_to_slide(0);
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
    if (number >= 0 && number < this.slides.length) {
      var face = this.cube.face_with_slide(number);
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
      if (number === 0) {
        location.hash = "";
      } else {
        location.hash = number;
      }
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

    var slide = this.slides[number];
    var face = $("#cube ." + face_name);
    this.cube.face_named(face_name).slide = number;
    if (slide.content) {
      face.html($(slide.content).html());
    } else {
      face.html('<h1 class="letter">' + slide.letter + '</h1>');
    }

    face.css("color", "#" + slide.foreground);
    if (slide.background) { face.css("background-color", "#" + slide.background); }
    if (slide.image) { face.css("background-image", "url('images/" + slide.image + ".png')"); }

    if (slide.inset === "shadow") {
      face.css("text-shadow", "black -1px -1px 0");
    } else {
      face.css("text-shadow", "white 1px 1px 0");
    }
  }
};
