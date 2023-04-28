import {controller} from './controller.js'

export function Thumbnail (container) {
  this.container = container,
  this.video = this.container.children[0],
  this.thumbnail = this.container.children[1],
  this.gif = null,
  this.gifHandler
}

Thumbnail.prototype.animate = function (count) {
  let thisThumbnail = this;

  if (controller.getMobileStatus()) {
    setTimeout (function() {
      thisThumbnail.container.classList.toggle('display-default');
    }, 500 + (count * 200));
  }

  setTimeout (function() {
    thisThumbnail.thumbnail.classList.toggle('temp-invisibility');
  }, 1000 + (count * 200));
}

Thumbnail.prototype.expand = function () {
  this.fadeTransition(this.container);
  this.video.play();
}

Thumbnail.prototype.collapse = function () {
  this.video.load();
  this.fadeTransition(this.container);
}

Thumbnail.prototype.fadeTransition = function (selection) {
  let thisMoment = this;

  thisMoment.container.classList.toggle('opaque');
  thisMoment.thumbnail.classList.toggle('temp-invisibility');

  setTimeout(function() {
    thisMoment.container.classList.toggle('featured-child');

    setTimeout(function() {
      thisMoment.container.classList.toggle('opaque');
    }, 600);
  }, 600);
}

Thumbnail.prototype.createGif = function (link) {
  let thisMoment = this;

  return new Promise ((resolve, reject) => {
    let gif = document.createElement("video");

    gif.src = link;
    gif.muted = true;
    gif.playsInline = true;

    // check if gif has loaded
    gif.addEventListener('loadeddata', (e) => {
      if (gif.readyState >= 3) {
        let image = thisMoment.thumbnail;

        thisMoment.thumbnail.append(gif);
        thisMoment.thumbnail.children[0].remove;

        thisMoment.gif = gif;

        resolve();
      }
    });
  });
}

Thumbnail.prototype.playGif = function () {
  let thisMoment = this;

  return new Promise ((resolve, reject) => {
    let endHandler = function() {
      thisMoment.gif.removeEventListener("ended", endHandler);
      resolve();
    };

    thisMoment.gif.addEventListener("ended", endHandler);

    thisMoment.gifHandler = endHandler;
    thisMoment.gif.play();
  });
}

Thumbnail.prototype.pauseGif = function () {
  this.gif.removeEventListener("ended", this.gifHandler);
  this.gif.pause();
}
