let previousSelection, thumbnailsLoaded, deviceWidth, gifTimer, randThumbnails,
loadedGifs = [];

window.addEventListener('load', function() {
  deviceWidth = screen.width;
  let moments = createMoments();

  animateIntro(moments);
});

function createMoments() {
  const moments = document.getElementsByClassName('gallery-item');
  let thumbnails = [];

  for (let i = 0; i < moments.length; i++) {
    let moment = moments[i];
    let momentContent = moment.children;
    let thumbnail = momentContent[1];

    if (deviceWidth < 600) {
      moment.classList.toggle('display-default');
    }

    thumbnails.push(thumbnail);

    if (thumbnails.length == moments.length) {

      if (deviceWidth > 600) {
        let links = fetch("json/videos.json").then(response => {
             return response.json();

        }).then(jsondata => {
          let index = 0;

          for (property in jsondata) {
            let container = thumbnails[index];
            let gif = createGif(container, jsondata[property].thumbnail);

            index ++;
          }
        });

        var statusCheck = setInterval(function() {
          checkGifStatus(statusCheck)
        }, 3000);
      }

      return thumbnails;
    }
  }
}

function createGif(container, link) {
  let thumbnailImg = container.querySelector('img');
  let gif = document.createElement("video");

  gif.src = link;
  gif.muted = "true";
  gif.playsInline = "true";

  container.appendChild(gif);

  // check if gif has loaded
  gif.addEventListener('loadeddata', (e) => {

    if (gif.readyState >= 3) {
     container.removeChild(thumbnailImg);
     loadedGifs.push(gif);
    }
  });
}

function checkGifStatus(statCheck) {
  console.log("checking gif status");

  if (loadedGifs.length >= 5 && thumbnailsLoaded && !previousSelection) {
    console.log( loadedGifs.length + " gifs loaded");

    clearInterval(statCheck);
    playGifs();
  }
}

function playGifs() {
  let randNums = [];
  let gifsPlayed = 0;
  randThumbnails = [];

  console.log("playing gifs");

  while (randThumbnails.length < 5) {
    let randNum = Math.floor(Math.random() * loadedGifs.length);
    let randThumbnail = loadedGifs[randNum];

    if (randNums.indexOf(randNum) === -1) {
      randThumbnail.addEventListener("ended", function() {

        var handler = function() {
          let thumbIndex =  randThumbnails.indexOf(this);

          console.log("video " + (thumbIndex + 1) + " ended");

          randThumbnails[thumbIndex].removeEventListener("ended", handler);

          gifsPlayed += 1;

          console.log((randThumbnails.length - gifsPlayed) + " videos playing");

          if (gifsPlayed > 4) {
            gifTimer = setTimeout(playGifs, 15000);
          }
        };``

        return handler;
      }());

      randThumbnails.push(randThumbnail);
      randNums.push(randNum);
    }
  }

  for (let i = 0; i < randThumbnails.length; i ++) {
    let gif = randThumbnails[i];

    gif.play();
  }
}

function animateIntro(thumbnails) {
  const gallery = document.getElementsByClassName("square-gallery")[0];
  let randIndexes = deviceWidth > 600 ? getRandNumArray(50) : false;

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

            // randomly fade in each thumbnail
            for (let i = 0; i < thumbnails.length; i++) {
              let randomThumbnail = randIndexes ? thumbnails[randIndexes[i]] : thumbnails[i];
              let thumbParent = randomThumbnail.parentElement;

              if (deviceWidth < 600) {
                if (i == 0) {
                  animateTitle(i);
                }

                setTimeout(function() {
                  thumbParent.classList.toggle('display-default');
                }, 500 + (i * 200));

              } else {
                if (i == 49) {
                  animateTitle(i);
                }
              }

              setTimeout(function() {
                randomThumbnail.classList.toggle('visibility');
              }, 1000 + (i * 200));
            }
          }, 1250);
        }, 1250);
      }, 1250);
    }, 1250);
  }, 1250);
}

// animate title and info button in
function animateTitle(count) {
  const title = document.getElementById("title-container");
  const modal = document.getElementById("modal");
  const infoBtn = document.getElementById("info-button");
  const closeBtn = document.getElementById("close-button");

  setTimeout(function() {
    title.classList.add("visible-header");
    infoBtn.classList.add("visible-button");

    thumbnailsLoaded = true;
  }, 1000 + (count * 200));

  // bind modal buttons
  infoBtn.addEventListener('click', function() {
    openModal(modal)
  });

  closeBtn.addEventListener('click', function() {
    closeModal(modal)
  });
}

function getRandNumArray(length) {
  let randNums = [];

  while (randNums.length < length) {
    let randNum = Math.floor(Math.random() * 50);

    if (randNums.indexOf(randNum) === -1) randNums.push(randNum);
  }

  return randNums;
}

function expandSquare(e) {

  if (thumbnailsLoaded) {
    let currentSelection = {
      container: e,
      thumbnail: e.querySelector('.thumbnail'),
      video: e.querySelector('.vid')
    }

    if (previousSelection) {
      previousSelection.video.load();
      fadeTransition(previousSelection);

      if (previousSelection.container.dataset.index !== currentSelection.container.dataset.index) {
        fadeTransition(currentSelection);
        currentSelection.video.play();

        previousSelection = currentSelection;
      } else {

        previousSelection = null;
      }

    } else {
      pauseGifs();
      fadeTransition(currentSelection);
      currentSelection.video.play();

      previousSelection = currentSelection;
    }
  }
}

function pauseGifs() {

  if (randThumbnails.length > 0) {
    console.log("pausing gifs");

    for (let i = 0; i < randThumbnails.length; i ++) {
      let gif = randThumbnails[i];

      gif.pause();
    }
  }

  clearInterval(gifTimer);

  var statusCheck = setInterval(function() {
    checkGifStatus(statusCheck)
  }, 3000);
}

function fadeTransition(selection) {
  selection.container.classList.toggle('opaque');
  selection.thumbnail.classList.toggle('visibility');

  setTimeout(function() {
    selection.container.classList.toggle('featured-child');

    setTimeout(function() {
      selection.container.classList.toggle('opaque');
    }, 600);
  }, 600);
}

function collapseSquare() {
  previousSelection.container.classList.remove('featured-child');
  previousSelection.thumbnail.classList.toggle('visibility');

  previousSelection = null;
}

function openModal(modal) {
  if (previousSelection) {
    if (previousSelection.video) {
        previousSelection.video.pause();
    }

    previousSelection.container.classList.toggle('featured-child');
    previousSelection = null;
  }

  modal.style.visibility = "visible";
}

function closeModal(modal) {
  modal.style.visibility = "hidden";
}
