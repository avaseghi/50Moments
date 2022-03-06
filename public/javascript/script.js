let previousSelection, lastInteraction;

window.addEventListener('load', (event) => {
  animateIntro();

  // lastInteraction = new Date();
  // setInterval(interactionTimer, 1000);
});


async function animateIntro() {
  const title = document.getElementById("title-container");
  const infoBtn = document.getElementById("info-button");
  const closeBtn = document.getElementById("close-button");
  const gallery = document.getElementsByClassName("square-gallery")[0];
  const modal = document.getElementById("modal");
  let thumbnails = await createMoments(gallery);

  // fade in credit
  setTimeout(function () {
    gallery.classList.toggle('credit');
    gallery.classList.toggle('fade-in');

      // fade out credit
      setTimeout(function() {
        gallery.classList.toggle('fade-in');

        // fade in title
        setTimeout(function() {
          gallery.classList.toggle('fade-in');
          gallery.classList.toggle('credit');
          gallery.classList.toggle('title');

          // fade out title
          setTimeout(function() {
            gallery.classList.toggle('fade-in');
            let index = 1;

            // randomly fade in each thumbnail
            while(thumbnails.length > 0){
              let randNum = Math.floor(Math.random() * thumbnails.length);
              let randomThumbnail = thumbnails[randNum];

              setTimeout(function() {
                randomThumbnail.style.opacity = "1";
              }, index * 200 );

              // animate title and info button in
              if (index === 50) {
                setTimeout(function() {
                  title.classList.add("visible-header");
                  infoBtn.classList.add("visible-button");
                }, index * 200 );
              }

              thumbnails.splice(randNum, 1);
              index ++;
            }
          }, 3800);
        }, 2350);
    }, 2300);
  }, 150);

  // bind modal buttons
  infoBtn.addEventListener('click', function() {
    openModal(modal)
  });
  closeBtn.addEventListener('click', function() {
    closeModal(modal)
  });
}

async function createMoments(momentsGallery) {
  let thumbnails = [];

  for (let i = 0; i < 50; i++) {
    let moment = document.createElement("div");
    let thumbnail = document.createElement("div");
    let image = document.createElement("img");

    moment.classList.add('gallery-item');
    thumbnail.classList.add('thumbnail');

    // assign moment an index to be used on expand
    moment.index = i;
    // bind thumbnail clicks
    moment.addEventListener('click', element => expandSquare(element));

    thumbnail.appendChild(image);
    moment.appendChild(thumbnail);

    // temporary logic to only load thumbnail and featured videos that we have so far
    if (i === 8 || i === 36) {
      let gifLoaded = await loadVideo(thumbnail,  "../thumbnails/thumbnail_" + (i + 1) + ".mp4", bindThumbnailEvents);

      if (gifLoaded) {
        momentsGallery.appendChild(moment);
        thumbnails.push(thumbnail);
      }
    } else if (i === 0) {
      let videoLoaded = await loadVideo(moment, "https://player.vimeo.com/progressive_redirect/playback/670885525/rendition/1080p?loc=external&signature=b3279a20155efa74b5c2c50cf90d291a39ab8e3941db268a92aba7c950c1afdd", bindVideoEvents);

      if (videoLoaded) {
        momentsGallery.appendChild(moment);
        thumbnails.push(thumbnail);
      }
    } else if (i === 10) {
      let videoLoaded = await loadVideo(moment, "https://player.vimeo.com/progressive_redirect/playback/670885845/rendition/1080p?loc=external&signature=bd688e74915358ad1930b4067105c80973edd936b5d2592e1e276aff1072b34e", bindVideoEvents);

      if (videoLoaded) {
        momentsGallery.appendChild(moment);
        thumbnails.push(thumbnail);
      }
    } else {
      momentsGallery.appendChild(moment);
      thumbnails.push(thumbnail);
    }
  }

  return new Promise(resolve => {
   resolve(thumbnails);
  });
}

function loadVideo(container, source, binding) {
  let video = document.createElement("video");

  video.src = source;
  container.appendChild(video);
  binding(video);

  return new Promise(resolve => {
    video.addEventListener('canplay', function() {
      resolve(true);
    });
  });
}

function bindThumbnailEvents(gif) {
  let image = gif.previousSibling;

  gif.addEventListener("ended", function() {
    image.style.opacity = "1";
  });
}

function bindVideoEvents(video) {
  video.classList.add('vid');

  video.addEventListener("ended", function() {
   previousSelection.container.classList.remove('featured-child');
   previousSelection = null;
  });
}

function expandSquare(e) {
  let currentSelection = {
    container: e.currentTarget,
    video: e.currentTarget.querySelector('.vid')
  }

  if (previousSelection) {
    if (previousSelection.video) {
        previousSelection.video.pause();
    }

    fadeTransition(previousSelection);

    if (previousSelection.container.index !== currentSelection.container.index) {
      fadeTransition(currentSelection);

      if (currentSelection.video) {
        currentSelection.video.play();
      }

      previousSelection = currentSelection;

    } else {
      previousSelection = null;
    }

  } else {
    fadeTransition(currentSelection);

    if (currentSelection.video) {
      currentSelection.video.play();
    }

    previousSelection = currentSelection;
  }
}

function fadeTransition(selection) {
  selection.container.classList.toggle('opaque');

  setTimeout(function() {
    selection.container.classList.toggle('featured-child');

    setTimeout(function() {
      selection.container.classList.toggle('opaque');
    }, 600);
  }, 600);
}

function openModal(modal) {
  console.log("opening modal");

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

// gif timer
function interactionTimer() {
  let currentTime = new Date();
  let dif = lastInteraction.getTime() - currentTime.getTime();

  let secondsFrom = dif / 1000;
  let secondsBetween = Math.abs(secondsFrom);

  console.log(secondsBetween);

  // every 10 seconds trigger a new set of gifs
  if (secondsBetween >= 10) {
    if (!previousSelection) {
      for (let i = 0; i < thumbnails.length; i ++) {
        let thumbnail = {
          image: thumbnails[i].querySelector('img'),
          video: thumbnails[i].querySelector('video')
        }
        thumbnail.image.style.opacity = "0";
        thumbnail.video.play();
      }
    }
    lastInteraction = currentTime;
  }
}
