let previousSelection, lastInteraction, thumbnail, modal;

window.addEventListener('load', (event) => {
  const moments = document.getElementsByClassName("gallery-item");
  const videos = document.getElementsByClassName("vid");
  thumbnails = document.getElementsByClassName("test");
  const infoBtn = document.getElementById("info-button");
  modal = document.getElementById("modal");
  const closeBtn = document.getElementById("close-button");

  console.log("Page loaded");

  lastInteraction = new Date();
  setInterval(interactionTimer, 1000);

  for (let i = 0; i < moments.length; i++) {
    // if (i <= 39) {
    //   let video = document.createElement("video");
    //
    //   video.src = "./videos/video_" + (i + 1) + ".mp4";
    //   video.addEventListener("ended", function() {
    //     previousSelection.container.classList.remove('featured-child');
    //     previousSelection = null;
    //   });
    //
    //   moments[i].appendChild(video);
    // }

    moments[i].index = i;
    moments[i].addEventListener('click', element => expandSquare(element));
  }

  for(let i = 0; i < thumbnails.length; i ++) {
    let thumbnail = {
      image: thumbnails[i].querySelector('img'),
      video: thumbnails[i].querySelector('video')
    }

    if (thumbnail.video) {
      thumbnail.video.addEventListener("ended", function() {
        thumbnail.image.style.opacity = "1";
      });
    }
  }

  for (let i = 0; i < videos.length; i++) {
    videos[i].addEventListener("ended", function() {
      previousSelection.container.classList.remove('featured-child');
      previousSelection = null;
    });
  }

  infoBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
});

function interactionTimer() {
  let currentTime = new Date();
  let dif = lastInteraction.getTime() - currentTime.getTime();

  let secondsFrom = dif / 1000;
  let secondsBetween = Math.abs(secondsFrom);

  console.log(secondsBetween);

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

function expandSquare(e) {
  let currentSelection = {
    container: e.currentTarget,
    video: e.currentTarget.querySelector('.vid')
  }

  if (previousSelection) {
    if (previousSelection.video) {
        previousSelection.video.pause();
    }
      
    previousSelection.container.classList.replace('fadein', 'fadeout');

    setTimeout(() => {
      currentSelection.container.classList.toggle('expand');
    }, 780);

    if (previousSelection.container.index !== currentSelection.container.index) {
      
      if (currentSelection.video) {
        currentSelection.video.play();
      }
      previousSelection = currentSelection;

    } else {
      previousSelection = null;
    }
  } else {
    if (currentSelection.video) {
      currentSelection.video.play();
    }

    currentSelection.container.classList.add('fadein');
   
    setTimeout(() => {
      currentSelection.container.classList.add('expand');
    }, 850);

    previousSelection = currentSelection;
    previousSelection.container.classList.replace('fadeout', 'fadein');
  }
}

function openModal() {
  if (previousSelection) {
    if (previousSelection.video) {
        previousSelection.video.pause();
    }
    previousSelection.container.classList.toggle('fade');
    previousSelection = null;
  }

  modal.style.visibility = "visible";
}

function closeModal() {
  modal.style.visibility = "hidden";
}