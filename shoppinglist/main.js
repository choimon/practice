const itemList = document.querySelector('.item-list');
const items = document.querySelectorAll('.item-row');
const addIcon = document.querySelector('.add-icon');
const trashIcons = document.querySelectorAll('.item-delete-icon');
const textInput = document.querySelector('.input-text');

function onAdd(itemStr) {
  if (!itemStr || itemStr === '') {
    textInput.focus(); // bc focus gets moved to button.
    return;
  }

  const newLi = createItem(itemStr);

  textInput.value = '';
  textInput.focus();
  itemList.append(newLi);

  newLi.scrollIntoView({ block: 'center' });
  return;
}

// let id = 0;
let id = items.length; // for existing items
function createItem(text) {
  const itemRow = document.createElement('li');
  itemRow.setAttribute('class', 'item-row');
  itemRow.setAttribute('data-id', id);

  // if i put data-id to only i, then clicking a space bt i and the button doesn't result in removing inside the event listener
  itemRow.innerHTML = `
      <div class="item" data-id=${id}>
        <span class="item-text" data-id=${id}>${text}</span>
        <button class="item-delete-icon" data-id=${id}>
          <i class="fas fa-trash-alt" data-id=${id}></i>
        </button>
      </div>
      <div class="item-divider"></div>
  `;
  id++;

  // const itemRow = document.createElement('li');
  // itemRow.setAttribute('class', 'item-row');
  // const item = document.createElement('div');
  // item.setAttribute('class', 'item');

  // const name = document.createElement('span');
  // name.setAttribute('class', 'item-text');
  // name.innerHTML = text;
  // item.addEventListener('click', () => {    //////
  //   toggleStrike(name);
  // });

  // const deleteBtn = document.createElement('button');
  // deleteBtn.setAttribute('class', 'item-delete-icon');
  // deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
  // deleteBtn.addEventListener('click', () => {
  //   itemList.removeChild(itemRow);
  // });

  // const itemDivider = document.createElement('div');
  // itemDivider.setAttribute('class', 'item-divider');

  // item.appendChild(name);
  // item.appendChild(deleteBtn);

  // itemRow.appendChild(item);
  // itemRow.appendChild(itemDivider);
  return itemRow;
}

function toggleStrike(item) {
  item.classList.toggle('stroked');
}

function deleteItem(item) {
  item.parentElement.parentElement.remove();
}

textInput.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    onAdd(textInput.value);
  }
});

addIcon.addEventListener('click', () => {
  onAdd(textInput.value);
});

// initializing for existing ones
/*
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
*/

// using event delegation
itemList.addEventListener('click', (event) => {
  const id = event.target.dataset.id;
  if (id) {
    const targetNode = event.target.nodeName;
    if (targetNode === 'I' || targetNode === 'BUTTON') {
      // if more than one button/I :
      // const className = 'fas fa-trash-alt'
      // if (event.target.className === 'fas fa-trash-alt')
      const toBeDeleted = document.querySelector(`.item-row[data-id="${id}"]`);
      toBeDeleted.remove();
    } else {
      // const name = document.createElement('span');
      // item.addEventListener('click', () => {    //////
      //   toggleStrike(name);
      // });
      const toBeToggled = document.querySelector(
        `.item-row[data-id="${id}"] .item-text`
      );
      toggleStrike(toBeToggled);
    }
  }
});
