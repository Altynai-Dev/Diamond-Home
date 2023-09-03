// СОХРАНЯЕМ API (база данных) в переменную API
const API = 'http://localhost:8000/products';
const API2 = 'http://localhost:8000/users';

let inpName = document.getElementById('inpName');
let inpDesc = document.getElementById('description');
let inpImage = document.getElementById('inpImage');
let inpPrice = document.getElementById('inpPrice');
let inpCategory = document.getElementById('category');

let btnAdd = document.getElementById('btnAdd');
let btnOpenForm = document.getElementById('flush-collapseOne');
let sectionProducts = document.getElementById('sectionProducts');

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
    !inpDesc.value.trim() ||
    !inpImage.value.trim() ||
    !inpPrice.value.trim() ||
    !inpCategory.value.trim()
  ) {
    alert('Fill all the inputs');
    return;
  }
  let newProduct = {
    name: inpName.value,
    desc: inpDesc.value,
    image: inpImage.value,
    price: inpPrice.value,
    category: inpCategory.value,
  };
  createProducts(newProduct);
  readProducts();
});

// Create
function createProducts(product) {
  fetch(API, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(product),
  }).then(() => readProducts());
  inpName.value = '';
  inpDesc.value = '';
  inpImage.value = '';
  inpPrice.value = '';
  inpCategory.value = '';
  btnOpenForm.classList.toggle('show');
}

// Read отображение данных
function readProducts() {
  fetch(`${API}?q=${searchValue}?&_page=${currentPage}&_limit=9`) //для поиска, page будет указывать на currentPage, больше 6 объектов не отображается
    .then((res) => res.json())
    .then((data) => {
      sectionProducts.innerHTML = '';
      data.forEach((item) => {
        sectionProducts.innerHTML += `
                  <div class="card m-4 cardBook" style="width: 18rem">
                      <img id="${item.id}" src="${item.image}" class="card-img-top detailsCard" style="height: 280px" alt="${item.name}"/>
                      <div class="card-body">
                          <h5 class="card-title">${item.name}</h5>
                          <p class="card-text">
                            ${item.price}
                          </p>
                          <button class="btn btn-outline-secondary btnDelete" id="${item.id}">
                              Delete
                          </button>
                          <button class="btn btn-outline-secondary btnEdit" id="${item.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">
                              Edit
                          </button>
                      </div>
                  </div>
              `;
      });
      pageFunc();
    });
}

readProducts();
//delete
document.addEventListener('click', (e) => {
  //все элементы, на которых происходит событие
  let del_class = [...e.target.classList]; //сохраняем в массив все классы, на которых происходит событие
  if (del_class.includes('btnDelete')) {
    let del_id = e.target.id;
    fetch(`${API}/${del_id}`, {
      method: 'DELETE',
    }).then(() => readProducts());
  }
});

//edit
let editInpName = document.getElementById('editInpName');
let editInpDesc = document.getElementById('editInpDesc');
let editInpImage = document.getElementById('editInpImage');
let editInpPrice = document.getElementById('editInpPrice');
let editInpCategory = document.getElementById('editInpCategory');
let editBtnSave = document.getElementById('editBtnSave');

document.addEventListener('click', (e) => {
  let arr = [...e.target.classList];
  if (arr.includes('btnEdit')) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editInpName.value = data.name;
        editInpDesc.value = data.desc;
        editInpImage.value = data.image;
        editInpPrice.value = data.price;
        editInpCategory.value = data.category;
        editBtnSave.setAttribute('id', data.id);
      });
  }
});

editBtnSave.addEventListener('click', () => {
  let editedProduct = {
    name: editInpName.value,
    desc: editInpDesc.value,
    image: editInpImage.value,
    price: editInpPrice.value,
    category: editInpCategory.value,
  };
  editProduct(editedProduct, editBtnSave.id);
});
//put полностью заменяет объект
//patch частично заменяет
function editProduct(editedProduct, id) {
  fetch(`${API}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(editedProduct),
  }).then(() => readProducts());
}

//search
let inpSearch = document.getElementById('inpSearch');
inpSearch.addEventListener('input', (e) => {
  searchValue = e.target.value;
  readProducts();
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
  readProducts();
});

nextBtn.addEventListener('click', () => {
  if (currentPage >= countPage) return;
  currentPage++;
  readProducts();
});
// Details
let detailsModal = document.querySelector('.info-modal');
let modalImage = document.querySelector('.info-modal__image');
let modalTitle = document.querySelector('.info-modal__title');
let modalDesc = document.querySelector('.info-modal__desc');
let modalPrice = document.querySelector('.info-modal__price');
let modalCloseBtn = document.querySelector('.info-modal__close-btn');

document.addEventListener('click', (e) => {
  let classImg = [...e.target.classList];
  if (classImg.includes('detailsCard')) {
    details(e.target.id);
    detailsModal.style.display = 'block';
  }
});
modalCloseBtn.addEventListener('click', () => {
  detailsModal.style.display = 'none';
});
function details(id) {
  try {
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        modalImage.setAttribute('src', `${data.image}`);
        modalTitle.textContent = data.name;
        modalDesc.innerText = data.desc;
        modalPrice.innerText = `Price: ${data.price}`;
      });
  } catch {
    console.log('Error');
  }
}
const menu = document.querySelector('.menu');
const toggle = document.querySelector('.toggle');
toggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});

// Registration
let registerBtnNav = document.querySelector('.register-btn');
let registerShow = document.querySelector('.register');
let registerForm = document.querySelector('.register__form');
let registerSubmitButton = document.querySelector('.register__button');
let userNameInp = document.querySelector('.register__name');
let userEmailInp = document.querySelector('.register__email');
let userPasswordInp = document.querySelector('.register__password');
let registerCloseBtn = document.querySelector('.register__close-btn');

registerBtnNav.addEventListener('click', () => {
  registerShow.style.display = 'block';
});
registerCloseBtn.addEventListener('click', () => {
  registerShow.style.display = 'none';
});
registerSubmitButton.addEventListener('click', () => {
  let newUser = {
    userName: userNameInp.value,
    userEmail: userEmailInp.value,
    userPassword: userPasswordInp.value,
  };
  handleSubmit(newUser);
  registerShow.style.display = 'none';
});

function handleSubmit(user) {
  fetch(API2, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((data) => alert(`${data.userName}, you have successfully signed up!`))
    .catch((err) => console.log(err));
  userNameInp.value = '';
  userEmailInp.value = '';
  userPasswordInp.value = '';
}

//Login
let loginForm = document.querySelector('.login-form');
let loginOpenBtn = document.querySelector('.login-btn');
let loginButton = document.querySelector('.login__button');
let loginEmail = document.querySelector('.login__email');
let loginPassword = document.querySelector('.login__password');
let loginCloseBtn = document.querySelector('.login__close-btn');

loginOpenBtn.addEventListener('click', () => {
  loginForm.style.display = 'block';
});

loginCloseBtn.addEventListener('click', () => {
  loginForm.style.display = 'none';
});
loginButton.addEventListener('click', (e) => {
  e.preventDefault();
  fetch(API2)
    .then((res) => res.json())
    .then((data) => {
      let searchedUserObj = data.filter((user) => user.userEmail == loginEmail.value);
      if (searchedUserObj[0].userPassword == loginPassword.value) {
        alert('You have successfully logged in!!!');
        loginForm.style.display = 'none';
      } else {
        alert('Incorrect email or password');
        loginEmail.style.border = '2px solid red';
        loginPassword.style.border = '2px solid red';
      }
    });
});
let categoryRingsBtn = document.querySelector('.category__rings');
let categoryNecklacesBtn = document.querySelector('.category__necklaces');
let categoryBraceletsBtn = document.querySelector('.category__bracelets');
let categoryEarringsBtn = document.querySelector('.category__earrings');

categoryRingsBtn.addEventListener('click', () => {
  filter('rings');
});
categoryNecklacesBtn.addEventListener('click', () => {
  filter('necklaces');
});
categoryBraceletsBtn.addEventListener('click', () => {
  filter('bracelets');
});
categoryEarringsBtn.addEventListener('click', () => {
  filter('earrings');
});

function filter(param) {
  fetch(`${API}?category=${param}`)
    .then((res) => res.json())
    .then((data) => {
      sectionProducts.innerHTML = '';
      data.forEach((item) => {
        sectionProducts.innerHTML += `
                  <div class="card m-4 cardBook" style="width: 18rem">
                      <img id="${item.id}" src="${item.image}" class="card-img-top detailsCard" style="height: 280px" alt="${item.name}"/>
                      <div class="card-body">
                          <h5 class="card-title">${item.name}</h5>
                          <p class="card-text">
                            ${item.price}
                          </p>
                          <button class="btn btn-outline-secondary btnDelete" id="${item.id}">
                              Delete
                          </button>
                          <button class="btn btn-outline-secondary btnEdit" id="${item.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">
                              Edit
                          </button>
                      </div>
                  </div>
              `;
      });
      pageFunc();
    });
}
