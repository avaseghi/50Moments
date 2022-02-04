let previousSelection, modal;
let intro = document.querySelector('.intro');
let introContainer = document.querySelector('.intro-container');
let introText = document.getElementById('text');
let bodyWrapper = document.getElementById('body-wrapper');

window.addEventListener('load', (event) => {
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
      introText.classList.add('fade');

      intro.style.visibility = 'hidden';
      bodyWrapper.style.visibility = 'visible';

      const moments = document.getElementsByClassName("gallery-item");
      const infoBtn = document.getElementById("info-button");
      modal = document.getElementById("modal");
      const closeBtn = document.getElementById("close-button");
    
      for(let i = 0; i < moments.length; i++) {
        moments[i].addEventListener('click', element => expandSquare(element));
      }
      
      infoBtn.addEventListener('click', openModal);
      closeBtn.addEventListener('click', closeModal);

    }, 3200)

  }, 2700)
  
});

function expandSquare(e) {
  let currentSelection = e.target;

  if (previousSelection) {
    previousSelection.classList.toggle('featured-child');

    if (previousSelection !== currentSelection) {
      currentSelection.classList.toggle('featured-child');
      previousSelection = currentSelection;

    } else {
      previousSelection = null;
    }
  } else {
    currentSelection.classList.toggle('featured-child');
    previousSelection = currentSelection;
  }
}

function openModal() {
  modal.style.visibility = 'visible';
}

function closeModal() {
  modal.style.visibility = 'hidden';
}
