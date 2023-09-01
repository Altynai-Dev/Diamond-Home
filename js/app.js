// СОХРАНЯЕМ API (база данных) в переменную API
const API = 'http://localhost:8000/products';

let inpName = document.getElementById('inpName');
let inpAuthor = document.getElementById('inpAuthor');
let inpImage = document.getElementById('inpImage');
let inpPrice = document.getElementById('inpPrice');
let btnAdd = document.getElementById('btnAdd');
let btnOpenForm = document.getElementById('flush-collapseOne');
let sectionBooks = document.getElementById('sectionBooks');
let searchValue = ''; //переменная для поиска
//кнопки для пагинации
let prevBtn = document.getElementById('prevBtn');
let nextBtn = document.getElementById('nextBtn');
//переменные для пагинации
let currentPage = 1;
let countPage = 1; //чтобы перелистывала по одной странице

btnAdd.addEventListener('click', () => {
  if (
    !inpName.value.trim() ||
    !inpAuthor.value.trim() ||
    !inpImage.value.trim() ||
    !inpPrice.value.trim()
  ) {
    alert('заполните поля');
    return;
  }
  let newBook = {
    bookName: inpName.value,
    bookAuthor: inpAuthor.value,
    bookImage: inpImage.value,
    bookPrice: inpPrice.value,
  };
  createBooks(newBook);
  readBooks();
});

// Create
function createBooks(book) {
  fetch(API, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(book),
  }).then(() => readBooks());
  inpName.value = '';
  inpAuthor.value = '';
  inpImage.value = '';
  inpPrice.value = '';
  btnOpenForm.classList.toggle('show');
}

// Read отображение данных
function readBooks() {
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=6`) //для поиска, page будет указывать на currentPage, больше 6 объектов не отображается
    .then((res) => res.json())
    .then((data) => {
      sectionBooks.innerHTML = '';
      data.forEach((item) => {
        sectionBooks.innerHTML += `
                  <div class="card m-4 cardBook" style="width: 18rem">
                      <img id="${item.id}" src="${item.bookImage}" class="card-img-top detailsCard" style="height: 280px" alt="${item.bookName}"/>
                      <div class="card-body">
                          <h5 class="card-title">${item.bookName}</h5>
                          <p class="card-text">
                              ${item.bookAuthor}
                          </p>
                          <button class="btn btn-outline-danger btnDelete" id="${item.id}">
                              Delete
                          </button>
                          <button class="btn btn-outline-warning btnEdit" id="${item.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">
                              Edit
                          </button>
                      </div>
                  </div>
              `;
      });
      pageFunc();
    });
}
readBooks();
//delete
document.addEventListener('click', (e) => {
  //все элементы, на которых происходит событие
  let del_class = [...e.target.classList]; //сохраняем в массив все классы, на которых происходит событие
  if (del_class.includes('btnDelete')) {
    let del_id = e.target.id;
    fetch(`${API}/${del_id}`, {
      method: 'DELETE',
    }).then(() => readBooks());
  }
});

//edit
let editInpName = document.getElementById('editInpName');
let editInpAuthor = document.getElementById('editInpAuthor');
let editInpImage = document.getElementById('editInpImage');
let editInpPrice = document.getElementById('editInpPrice');
let editBtnSave = document.getElementById('editBtnSave');

document.addEventListener('click', (e) => {
  let arr = [...e.target.classList];
  if (arr.includes('btnEdit')) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editInpName.value = data.bookName;
        editInpAuthor.value = data.bookAuthor;
        editInpImage.value = data.bookImage;
        editInpPrice.value = data.bookPrice;
        editBtnSave.setAttribute('id', data.id);
      });
  }
});

editBtnSave.addEventListener('click', () => {
  let editedBook = {
    bookName: editInpName.value,
    bookAuthor: editInpAuthor.value,
    bookImage: editInpImage.value,
    bookPrice: editInpPrice.value,
  };
  editBook(editedBook, editBtnSave.id);
});
//put полностью заменяет объект
//patch частично заменяет
function editBook(editedBook, id) {
  fetch(`${API}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(editedBook),
  }).then(() => readBooks());
}

//search
let inpSearch = document.getElementById('inpSearch');
inpSearch.addEventListener('input', (e) => {
  searchValue = e.target.value;
  readBooks();
});

//pagination
function pageFunc() {
  fetch(`${API}?q=${searchValue}`) //синтаксис для пагинации query
    .then((res) => res.json())
    .then((data) => {
      countPage = Math.ceil(data.length / 6); //округляем до 6 элементов
    });
}

prevBtn.addEventListener('click', () => {
  if (currentPage <= 1) return;
  currentPage--;
  readBooks();
});

nextBtn.addEventListener('click', () => {
  if (currentPage >= countPage) return;
  currentPage++;
  readBooks();
});
