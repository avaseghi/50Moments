let previousSelection, lastInteraction, thumbnailsLoaded,
thumbnailsCopy = [];

window.addEventListener('load', (event) => {
  animateIntro();
});


async function animateIntro() {
  const title = document.getElementById("title-container");
  const infoBtn = document.getElementById("info-button");
  const closeBtn = document.getElementById("close-button");
  const gallery = document.getElementsByClassName("square-gallery")[0];
  const modal = document.getElementById("modal");
  let thumbnails = createMoments(gallery);

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
            let index = 1;

            // randomly fade in each thumbnail
            while(thumbnails.length > 0) {
              let randNum = Math.floor(Math.random() * thumbnails.length);
              let randomThumbnail = thumbnails[randNum];

              setTimeout(function() {
                randomThumbnail.classList.toggle('visibility');
              }, 3000 + (index * 200));

              // animate title and info button in
              if (index === 50) {
                setTimeout(function() {
                  title.classList.add("visible-header");
                  infoBtn.classList.add("visible-button");

                  thumbnailsLoaded = true;

                  lastInteraction = new Date();
                  setInterval(interactionTimer, 1000);

                }, 3000 + (index * 200));
              }

              thumbnailsCopy.push(thumbnails.splice(randNum, 1));
              index ++;
            }
          }, 4000);
        }, 4000);
      }, 4000);
    }, 4000);
  }, 4000);

  // bind modal buttons
  infoBtn.addEventListener('click', function() {
    openModal(modal)
  });

  closeBtn.addEventListener('click', function() {
    closeModal(modal)
  });
}

function createMoments(momentsGallery) {
  let thumbnails = [];
  let index = 0;

  let links = fetch("../json/videos.json").then(response => {
       return response.json();
  }).then(jsondata => {
    for (property in jsondata) {
      let response = createMoment(index, jsondata[property]);

      momentsGallery.appendChild(response.moment);
      thumbnails.push(response.thumbnail);
      index ++;
    }
  });

  return thumbnails;
}

function createMoment(i, links) {
  let moment = document.createElement("div");
  let thumbnail = document.createElement("div");
  let image = document.createElement("img");
  let gifLoaded = loadVideo(thumbnail,  links.thumbnail, bindThumbnailEvents);
  let videoLoaded = loadVideo(moment, links.video, bindVideoEvents);

  moment.classList.add('gallery-item');
  thumbnail.classList.add('thumbnail');

  image.classList.add('image-default');
  image.classList.add('visibility');

  // assign moment an index to be used on expand
  moment.index = i;
  // bind thumbnail clicks
  moment.addEventListener('click', element => expandSquare(element));

  thumbnail.appendChild(image);
  moment.appendChild(thumbnail);

  return {thumbnail, moment};
}

function loadVideo(container, source, binding) {
  let video = document.createElement("video");

  video.src = source;

  container.appendChild(video);
  binding(video);
}

function bindThumbnailEvents(gif) {
  gif.muted = "true";

  gif.addEventListener("ended", function() {
    let image = gif.nextSibling;

    image.classList.toggle('visibility');
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
  if (thumbnailsLoaded) {
    let currentSelection = {
      container: e.currentTarget,
      thumbnail: e.currentTarget.querySelector('.thumbnail'),
      video: e.currentTarget.querySelector('.vid')
    }

    if (previousSelection) {
      previousSelection.video.pause();
      previousSelection.video.currentTime = 0;

      fadeTransition(previousSelection);

      if (previousSelection.container.index !== currentSelection.container.index) {
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

// gif timer
function interactionTimer(thumbnails) {
  let currentTime = new Date();
  let dif = lastInteraction.getTime() - currentTime.getTime();

  let secondsFrom = dif / 1000;
  let secondsBetween = Math.abs(secondsFrom);

  if (thumbnailsLoaded) {
    // every 10 seconds trigger a new set of gifs to play
    if (secondsBetween >= 15) {

      if (!previousSelection) {
        let randNums = generateRandomNum();

        for (let i = 0; i < randNums.length; i ++) {
          let randomMoment = thumbnailsCopy[randNums[i]][0];

          let thumbnail = {
            image: randomMoment.querySelector('img'),
            video: randomMoment.querySelector('video')
          }

          thumbnail.image.classList.toggle('visibility');
          thumbnail.video.play();
        }
      }

      lastInteraction = currentTime;
    }
  }
}

function generateRandomNum(){
  let numbers = [];

  while(numbers.length < 5) {
    let r = Math.floor(Math.random() * thumbnailsCopy.length);

    if(numbers.indexOf(r) === -1) numbers.push(r);
  }

  return numbers;
}
