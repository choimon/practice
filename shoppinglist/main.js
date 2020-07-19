const itemList = document.querySelector('.item-list');
const items = document.querySelectorAll('.item-text');
const addIcon = document.querySelector('.add-icon');
const trashIcons = document.querySelectorAll('.item-delete-icon');
const textInput = document.querySelector('.input-text');

function addItem(itemStr) {
  if (itemStr) {
    const newLi = document.createElement('li');
    newLi.innerHTML = `
        <span class="item-text" onClick="toggleStrike(this)">${itemStr}</span>
        <i class="fas fa-trash-alt item-delete-icon" onClick="deleteItem(this)"></i>
        `;
    textInput.value = '';
    itemList.append(newLi);
  }
}

function toggleStrike(item) {
  item.classList.toggle('stroked');
}

function deleteItem(item) {
  //   console.log(item);
  //   console.log(item.parentElement);
  item.parentElement.remove();
}

textInput.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    addItem(textInput.value);
  }
});

addIcon.addEventListener('click', () => {
  addItem(textInput.value);
});

// initializing for existing ones
items.forEach((item) => {
  item.addEventListener('click', () => {
    // https://stackoverflow.com/questions/18880890/how-do-i-toggle-an-elements-class-in-pure-javascript
    // item.classList.toggle('stroked');
    toggleStrike(item);
  });
});

trashIcons.forEach((item) => {
  item.addEventListener('click', (event) => {
    // console.log(this); //window
    deleteItem(item);
  });
});
