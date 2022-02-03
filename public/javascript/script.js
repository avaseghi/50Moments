let previousSelection, modal;

window.addEventListener('load', (event) => {
  const moments = document.getElementsByClassName("gallery-item");
  const infoBtn = document.getElementById("info-button");
  modal = document.getElementById("modal");
  const closeBtn = document.getElementById("close-button");

  console.log("Page loaded");
  
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

  infoBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
});

function expandSquare(e) {
  let currentSelection = {
    container: e.currentTarget,
    video: e.target.children[0]
  }

  if (previousSelection) {
    if (previousSelection.video) {
        previousSelection.video.pause();
    }
    previousSelection.container.classList.toggle('featured-child');

    if (previousSelection.container.index !== currentSelection.container.index) {
      currentSelection.container.classList.toggle('featured-child');

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
    currentSelection.container.classList.toggle('featured-child');
    previousSelection = currentSelection;
  }
}

function openModal() {
  if (previousSelection.video) {
      previousSelection.video.pause();
  }
  previousSelection.container.classList.toggle('featured-child');
  previousSelection = null;

  modal.style.visibility = "visible";
}

function closeModal() {
  modal.style.visibility = "hidden";
}
