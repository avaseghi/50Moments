import {controller} from './controller.js'

export const view =  {

  init : function () {
    this.animateIntro();
  },

  animateIntro: function () {
    let thisView = this;
    let onMobile = controller.getMobileStatus();
    let gallery = document.getElementsByClassName("gallery")[0];
    let thumbnails = controller.getThumbnails(50, 50, !onMobile);
    let title = document.getElementById("title-container");
    let infoButton = document.getElementById("info-button");

    // fade in credit part 1
    gallery.classList.toggle('elo-credit');
    gallery.classList.toggle('fade-in');

    // fade out credit part 1
    setTimeout(function() {
      gallery.classList.toggle('fade-in');

      // fade in credit part 2
      setTimeout(function() {
        gallery.classList.toggle('fade-in');
        gallery.classList.toggle('elo-credit');
        gallery.classList.toggle('sxsw-credit');

        // fade out credit part 1
        setTimeout(function() {
          gallery.classList.toggle('fade-in');

          // fade in title
          setTimeout(function() {
            gallery.classList.toggle('fade-in');
            gallery.classList.toggle('sxsw-credit');
            gallery.classList.toggle('title');

            // fade out title
            setTimeout(function() {
              gallery.classList.toggle('fade-in');

              // fade in thumbnails
              for (let i = 0; i < thumbnails.length; i ++) {
                thumbnails[i].animate(i);

                if (!onMobile) {
                  if (i === 49) {
                    setTimeout(function() {
                      title.classList.add("visible-header");
                      infoButton.classList.add("visible-button");

                      thisView.bindEvents(thumbnails, infoButton);

                      controller.createGifs().then(() => {
                        thisView.playGifs();
                      });
                    }, 1000 + (i * 200));
                  }

                } else {
                  if (i === 0) {
                    setTimeout(function() {
                      title.classList.add("visible-header");
                      infoButton.classList.add("visible-button");
                    }, 1000 + (i * 200));

                  } else if (i === 49) {
                    thisView.bindEvents(thumbnails, infoButton);
                  }
                }
              }
            }, 1250);
          }, 1250);
        }, 1250);
      }, 1250);
    }, 1250);
  },

  bindEvents: function (thumbnails, infoBtn) {
    let modal = document.getElementById("modal");
    let closeBtn = document.getElementById("close-button");
    let thisView = this;

    for (let i = 0; i < thumbnails.length; i ++) {
      let thumbnail = thumbnails[i];

      thumbnail.container.addEventListener("click", function() {
        controller.setSelection(thumbnail);
        thisView.handleVids();
      });

      thumbnail.video.addEventListener("ended", function() {
        controller.setSelection();
        thisView.handleVids();
      });
    }

    infoBtn.addEventListener('click', function() {
      controller.setSelection();
      thisView.handleVids();

      thisView.pauseGifs();
      modal.style.visibility = "visible";
    });

    closeBtn.addEventListener('click', function() {

      thisView.playGifs();
      modal.style.visibility = "hidden";
    });
  },

  handleVids: function () {
    let selections = controller.getSelections();

    if (selections.current) {
      selections.current.expand();

      if (!selections.previous) {
        this.pauseGifs();
      }
    }

    if (selections.previous) {
      selections.previous.collapse();

      if (!selections.current) {
        this.playGifs();
      }
    }
  },

  playGifs: function () {
    if (!controller.getMobileStatus()) {
      let gifs = controller.getGifs();
      let gifsPlayed = 0;
      let thisView = this;

      console.log("playing gifs");

      for (let i = 0; i < gifs.length; i ++) {
        gifs[i].playGif().then(() => {
          console.log("gif " + i + " ended");

          gifsPlayed ++;

          console.log((gifs.length - gifsPlayed) + " gifs playing");

          if (gifsPlayed > 4) {
            console.clear();
            console.log("gif timer started");

            let gifTimer = setTimeout(function() {
              controller.setGifs();
              controller.setGifTimer();
              thisView.playGifs();
            }, 15000);

            controller.setGifTimer(gifTimer);
          }
        });
      }
    } else {
        return;
    }
  },

  pauseGifs: function () {
    if (!controller.getMobileStatus()) {
      let gifs = controller.getGifs();
      let gifTimer = controller.getGifTimer();

      if (gifTimer) {
        console.log("clearing gif timer");

        clearTimeout(gifTimer);

        controller.setGifs();
        controller.setGifTimer();

      } else {
        console.log("pausing gifs");

        for (let i = 0; i < gifs.length; i++) {
          let gif = gifs[i];

          gif.pauseGif();
        }
      }
    } else {
      return;
    }
  }
}
