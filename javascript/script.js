let modal, currentSelection;

window.addEventListener('load', (event) => {
  const moments = document.getElementsByClassName("gallery-item");
  const infoBtn = document.getElementById("info-button");
  modal = document.getElementById("modal");
  const closeBtn = document.getElementById("close-button");

  for(let i = 0; i < moments.length; i++) {
    moments[i].addEventListener('click', (element, i) => expandSquare(element, i));
  }

  infoBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
});

function expandSquare(element, i) {

  console.log(i);

  if (currentSelection) {
    currentSelection.classList.remove("featured-child");
  }

  currentSelection = element.target;
  currentSelection.classList.add("featured-child");
}

function openModal() {
  modal.style.visibility = "visible";
}

function closeModal() {
  modal.style.visibility = "hidden";
}
