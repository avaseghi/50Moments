let previousSelection, lastInteraction, thumbnail, modal;

window.addEventListener('load', (event) => {
  const moments = document.getElementsByClassName("gallery-item");
  const videos = document.getElementsByClassName("vid");
  thumbnails = document.getElementsByClassName("test");
  const infoBtn = document.getElementById("info-button");
  modal = document.getElementById("modal");
  const closeBtn = document.getElementById("close-button");

  console.log("Page loaded");
  
  setTimeout(()=>{
    introText.classList.add('active');

    setTimeout(()=>{
      introText.classList.remove('active');
      introText.classList.add('fade');
    }, 1300)

  }, 500)

  setTimeout(()=>{
    introText.innerHTML = "50 Moments";
    introText.classList.remove('fade');
    introText.classList.add('active');

    setTimeout(()=>{
      introText.classList.remove('active');
      introText.classList.add('disappear');

      intro.style.visibility = 'hidden';
      bodyWrapper.style.visibility = 'visible';

      for (let i = 0; i < moments.length; i++) {
        moments[i].index = i;
        animateEvens(i);

        setTimeout(()=>{
          animateOdds(i);
        }, 10000)
      }

    }, 3200)

  }, 2500)
  
  function animateEvens(i) {
    if (i % 2 == 0) {

      setTimeout(()=>{
        moments[i].style.opacity = 1;
      }, 300 * i)

    }
  }

  function animateOdds(i){
    console.log('here');
    if (i % 2 == 1) {
      setTimeout(()=>{
        moments[i].style.opacity = 1;
      }, 300 * i)
    }
  }

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
  
  infoBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

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
  if (previousSelection) {
    if (previousSelection.video) {
        previousSelection.video.pause();
    }
    previousSelection.container.classList.toggle('featured-child');
    previousSelection = null;
  }

  modal.style.visibility = "visible";
}

function closeModal() {
  modal.style.visibility = 'hidden';
}
