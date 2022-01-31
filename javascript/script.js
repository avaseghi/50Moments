let modal, currentSelection;

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
  if (currentSelection) {
    currentSelection.classList.remove("featured-child");
  }

  currentSelection = e.target;
  currentSelection.classList.add("featured-child");
}

function openModal() {
  modal.style.visibility = "visible";
}

function closeModal() {
  modal.style.visibility = "hidden";
}
