let previousSelection, modal;

window.addEventListener('load', (event) => {
  const moments = document.getElementsByClassName("gallery-item");
  const infoBtn = document.getElementById("info-button");
  modal = document.getElementById("modal");
  const closeBtn = document.getElementById("close-button");

  for(let i = 0; i < moments.length; i++) {
    moments[i].addEventListener('click', element => expandSquare(element));
  }

  infoBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
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
  modal.style.visibility = "visible";
}

function closeModal() {
  modal.style.visibility = "hidden";
}
