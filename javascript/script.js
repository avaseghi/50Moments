let currentSelection;

window.addEventListener('load', (event) => {
  const moments = document.getElementsByClassName("gallery-item");

  for(let i = 0; i < moments.length; i++) {
    moments[i].addEventListener('click', element => expandSquare(element));
  }
});

function expandSquare(element) {
  if (currentSelection) {
    currentSelection.classList.remove("featured-child");
  }

  currentSelection = element.target;
  currentSelection.classList.add("featured-child");
}
