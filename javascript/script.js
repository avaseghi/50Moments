let previousSelection, lastInteraction, thumbnailsLoaded,
loadedGifs = [];

window.addEventListener('load', function() {
  let moments = createMoments();

  animateIntro(moments);
});

function createMoments() {
  const moments = document.getElementsByClassName('gallery-item');
  let thumbnails = [];

  for (let i = 0; i < moments.length; i++) {
    let moment = moments[i];
    let momentContent = moment.children;
    let video = momentContent[0];
    let thumbnail = momentContent[1];
    
    thumbnails.push(thumbnail);

    if (thumbnails.length == moments.length) {
      let links = fetch("../json/videos.json").then(response => {
           return response.json();
      }).then(jsondata => {
        let index = 0;

        for (property in jsondata) {
          let container = thumbnails[index];
          let gif = createGif(container, jsondata[property].thumbnail);

          index ++;
        }
      });

      return thumbnails;
    }
  }
}

function createGif(container, link) {
  let gif = document.createElement("video");

  gif.src = link;
  gif.muted = "true";
  gif.playsInline = "true";

  container.appendChild(gif);

  gif.addEventListener('loadeddata', (e) => {
  // check if gif has loaded

   if (gif.readyState >= 3){
       loadedGifs.push(container);

       if (loadedGifs.length >= 5 && !lastInteraction) {
         lastInteraction = new Date();

         setInterval(function() {
           gifTimer();
         }, 1000);

          console.log(loadedGifs.length + " gifs are now loaded");
       }
   }
  });
}

function gifTimer() {
  let currentTime = new Date();
  let dif = lastInteraction.getTime() - currentTime.getTime();

  let secondsFrom = dif / 1000;
  let secondsBetween = Math.abs(secondsFrom);

  // every 15 seconds trigger a new set of gifs to play
  if (secondsBetween >= 15 && thumbnailsLoaded) {
    if (!previousSelection) {
      let randNums = [];
      let randThumbnails = [];

      while (randThumbnails.length < 5) {
        let randNum = Math.floor(Math.random() * loadedGifs.length);
        let randThumbnail = loadedGifs[randNum];

        if (randNums.indexOf(randNum) === -1) {
          randThumbnails.push(randThumbnail);
          randNums.push(randNum);
        }
      }

      for (let i = 0; i < randThumbnails.length; i ++) {
        let thumbnail = {
          image: randThumbnails[i].querySelector('img'),
          gif: randThumbnails[i].querySelector('video')
        }

        if (thumbnail.image){
          randThumbnails[i].removeChild(thumbnail.image)
        }

        thumbnail.gif.play();
      }
    }

    lastInteraction = currentTime;
  }
}

function animateIntro(thumbnails) {
  const title = document.getElementById("title-container");
  const infoBtn = document.getElementById("info-button");
  const closeBtn = document.getElementById("close-button");
  const gallery = document.getElementsByClassName("square-gallery")[0];
  const modal = document.getElementById("modal");
  let randIndexes = getRandNumArray(50);

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
            for (let i = 0; i < randIndexes.length; i++) {
              let randomThumbnail = thumbnails[randIndexes[i]];

              setTimeout(function() {
                randomThumbnail.classList.toggle('visibility');
              }, 1000 + (i * 200));

              // animate title and info button in
              if (i === 49) {
                setTimeout(function() {
                  title.classList.add("visible-header");
                  infoBtn.classList.add("visible-button");

                  thumbnailsLoaded = true;

                }, 1000 + (i * 200));
              }
            }
          }, 1250);
        }, 1250);
      }, 1250);
    }, 1250);
  }, 1250);

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

    if(randNums.indexOf(randNum) === -1) randNums.push(randNum);
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
      fadeTransition(currentSelection);
      currentSelection.video.play();

      previousSelection = currentSelection;
    }
  }
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
