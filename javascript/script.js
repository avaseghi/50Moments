let currentSelection;

window.addEventListener('load', (event) => {
  const moments = document.getElementsByClassName("gallery-item");

  for(let i = 0; i < moments.length; i++) {
    moments[i].addEventListener('click', (element, i) => expandSquare(element, i));
  }
});

function expandSquare(element, i) {

  console.log(i);
  
  if (currentSelection) {
    currentSelection.classList.remove("featured-child");
  }

  currentSelection = element.target;
  currentSelection.classList.add("featured-child");
}
