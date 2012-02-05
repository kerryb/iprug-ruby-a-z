$(document).ready(function(){
  Presentation.init();
});

var Presentation = {
  slides: [
    {background: "#ffff00", foreground: "#0000ff", inset: "highlight", content: "#title"},
    {foreground: "#d7608e", inset: "shadow", letter: "A", images: ["activesupport"]},
    {foreground: "#ff0000", inset: "shadow", letter: "B", images: ["blocks"]},
    {foreground: "#0000ff", inset: "shadow", letter: "C", images: ["community", "coffeescript"]},
    {foreground: "#ff00ff", inset: "shadow", letter: "D", images: ["duck_typing", "dhh"]},
    {foreground: "#8888ff", inset: "highlight", letter: "E", images: ["enumerable"]},
    {foreground: "#cc00ff", inset: "shadow", letter: "F", images: ["functional"]},
    {foreground: "#d12f2d", inset: "shadow", letter: "G", images: ["gems"]},
    {foreground: "#0000ff", inset: "shadow", letter: "H", images: ["happiness"]},
    {foreground: "#ff8800", inset: "shadow", letter: "I", images: ["irb"]},
    {foreground: "#f13e3e", inset: "shadow", letter: "J", images: ["java", "jruby"]},
    {foreground: "#ffff00", inset: "shadow", letter: "K", images: ["kitten"]},
    {foreground: "#4400ff", inset: "shadow", letter: "L", images: ["licence"]},
    {foreground: "#d5b87c", inset: "shadow", letter: "M", images: ["magic", "matz"]},
    {background: "rgba(255, 255, 255, 0.7)", foreground: "#000000", inset: "highlight", letter: "N", content: "#nil"},
    {foreground: "#ff0000", inset: "shadow", letter: "O", images: ["open"]},
    {foreground: "#f36118", inset: "shadow", letter: "P", images: ["mr_fussy", "pragmatic"]},
    {foreground: "#af282a", inset: "shadow", letter: "Q", images: ["quiz"]},
    {foreground: "#4444ff", inset: "highlight", letter: "R", images: ["rake", "rack", "rvm", "rails", "rspec", "reminder"]},
    {foreground: "#2b423f", inset: "shadow", letter: "S", images: ["library"]},
    {background: "#cccccc", foreground: "#2e5d67", inset: "highlight", letter: "T", images: ["tdd"]},
    {foreground: "#dddfdf", inset: "shadow", letter: "U", images: ["obiwan"]},
    {background: "#58aaf7", foreground: "#d6471c", inset: "highlight", letter: "V", images: ["vim"]},
    {foreground: "#ff0000", inset: "highlight", letter: "W", images: ["why"]},
    {foreground: "#f33f57", inset: "shadow", letter: "X", images: ["xml"]},
    {foreground: "#ff8800", inset: "highlight", letter: "Y", images: ["young"]},
    {foreground: "white", inset: "shadow", letter: "Z", images: ["zero"]},
    {background: "#cccccc", foreground: "#444444", content: "#credits"}
  ],

  current_slide: 0,
  current_image: 0,
  current_face: "front",
  notes_showing: false,

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
    this.preload_images();
    $("#notes-0").show();
    $("#toggle-notes").click(Presentation.toggle_notes);
    $("#notes a").attr("target", "ruby_a_to_z_links");
    $(document).keydown(function(e) {
      Presentation.handleKeyDown(e.which);
    });
    this.cube.populate();
    this.show_initial_slide();
  },

  preload_images: function() {
    images = $.map(this.slides.map(function(s) {return s.images;}), function(a) {return a;});
    images.forEach(function(i) { (new Image()).src = "images/" + i + ".png"; });
  },

  face_element_named: function(name) {
    return $("#cube ." + name);
  },

  show_initial_slide: function() {
    if (location.hash !== "") {
      var requested = location.hash.substr(1).split(".");
      this.go_to_slide(parseInt(requested[0], 10));
      if (requested[1]) {
        this.current_image = parseInt(requested[1], 10);
        this.change_image();
      }
    }
  },

  toggle_notes: function() {
    if (self.notes_showing) {
      $("#main").css("right", "0");
      $("#notes").css("left", "100%");
      self.notes_showing = false;
    } else {
      $("#main").css("right", "30%");
      $("#notes").css("left", "70%");
      self.notes_showing = true;
    }
  },

  handleKeyDown: function(key) {
    if ([32, 13, 39, 40].indexOf(key) > -1) {
      this.next();
    } else if ([37, 38].indexOf(key) > -1) {
      this.previous();
    } else if (key >= 65 && key <= 90) {
      this.go_to_slide(key - 64);
    }
  },

  next: function() {
    function has_another_image() {
      return Presentation.slides[Presentation.current_slide].images &&
        Presentation.slides[Presentation.current_slide].images.length > Presentation.current_image + 1;
    }

    if (has_another_image()) {
      this.current_image += 1;
      this.change_image();
    } else {
      this.current_image = 0;
      this.go_to_slide(this.current_slide + 1);
    }
  },

  previous: function() {
    if (Presentation.current_image > 0) {
      this.current_image -= 1;
      this.change_image();
    } else {
      this.current_image = 0;
      this.go_to_slide(this.current_slide - 1);
      this.change_image();
    }
  },

  change_image: function() {
    var images = this.slides[this.current_slide].images;
    if (images) {
      this.display_image(this.face_element_named(this.current_face),
          images[this.current_image]);
      location.hash = this.current_slide + "." + this.current_image;
    }
  },

  go_to_slide: function(number) {
    $("#notes div").hide();
    $("#notes-" + number).show();
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
    function not_this(f) { return f !== Presentation.current_face; }

    var next = Math.floor(Math.random() * 5);
    return ["front", "back", "left", "right", "top", "bottom"].filter(not_this)[next];
  },

  display_slide: function(face_name, number) {
    function h2d(h) {
      return parseInt(h,16);
    }

    var slide = this.slides[number];
    var face = this.face_element_named(face_name);
    this.cube.face_named(face_name).slide = number;
    if (slide.content) {
      face.html($(slide.content).html());
    } else {
      face.html('<h1 class="letter">' + slide.letter + '</h1>');
    }

    face.css("color", slide.foreground);
    if (slide.background) { face.css("background-color", slide.background); }
    if (slide.images) {
      this.display_image(face, slide.images[0]);
      this.current_image = 0;
    } else {
      this.remove_image(face);
    }

    if (slide.inset === "shadow") {
      face.css("text-shadow", "black -1px -1px 0");
    } else {
      face.css("text-shadow", "white 1px 1px 0");
    }
  },

  display_image: function(face, image) {
    face.css("background-image", "url('images/" + image + ".png')");
  },

  remove_image: function(face) {
    face.css("background-image", "");
  }
};
