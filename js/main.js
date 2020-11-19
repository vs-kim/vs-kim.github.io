'use strict';
//week1
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal")
const close = document.querySelector(".close")
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');//переменная логин
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');



let login = localStorage.getItem('Delivery');
//функция открытия/закрытия модального окна

function toggleModal()
{
   modal.classList.toggle("is-open");
}

function toggleModalAuth()
{
  modalAuth.classList.toggle('is-open');
}




buttonAuth.addEventListener('click', toggleModalAuth);
closeAuth.addEventListener('click', toggleModalAuth);

//методы когда авторизован
function authorized()
{
  console.log('Authorized');
  function logOut()
  {
    login = null;
    localStorage.removeItem('Delivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut)
    checkAuth();
  }
  

  userName.textContent = login;//показывает введенный логин
  buttonAuth.style.display = 'none';//кнопка войти пропадает
  userName.style.display = 'inline';//блок с логином
  buttonOut.style.display = 'block';//отоброжается кнопка выйти

  buttonOut.addEventListener('click', logOut);
}
//методы если еще не авторизован
function notAuthorized()
{

  console.log('NotAuthorized')
  
  function logIn(event)//евент тут нужен для вызова preventDefault
  {
    event.preventDefault();
    login = loginInput.value;// переменна хранит логин
    localStorage.setItem('Delivery', login);
    toggleModalAuth();//вызываем для того чтобы окно автоматически закрылось
    buttonAuth.removeEventListener('click', toggleModalAuth);
    closeAuth.removeEventListener('click', toggleModalAuth);
    logInForm.removeEventListener('submit', logIn);
    logInForm.reset();//после выхода из акк очищает поле логина
    checkAuth()
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);//кнопка войти
}

function checkAuth()
{
  if(login)
{
  authorized();
}
else
{
  notAuthorized();
}

}




//week2

function createCardRestaurant()
{
  const card = `
    <a class="card card-restaurant">
      <img src="img/tanuki/preview.jpg" alt=tanuki class="card-image"/>
          <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">Tanuki</h3>
            <span class="card-tag tag">60min</span>
          </div>
          <div class="card-info">
            <div class="rating">
              4.5
            </div>
            <div class="price">50$</div>
            <div class="category">Sushi&Rolls</div>
          </div>
      </div>
  </a>
  `;
  cardsRestaurants.insertAdjacentHTML("afterbegin", card);

}


function createCardGood()
{
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML("beforeend", `
  
  <img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
  <div class="card-text">
    <div class="card-heading">
      <h3 class="card-title card-title-reg">Classic</h3>
    </div>
    <div class="card-info">
      <div class="ingredients">Tomato sauce, Mozzarella cheese, Parmesan cheese, ham, salami, mushrooms.
      </div>
    </div>
    <div class="card-buttons">
      <button class="button button-primary button-add-cart">
        <span class="button-card-text">Cart</span>
        <span class="button-cart-svg"></span>
      </button>
      <strong class="card-price-bold">60$</strong>
    </div>
  </div>

  `);
  cardsMenu.insertAdjacentElement('beforeend',card);
}

function openGoods(event)
{

  const target =  event.target;

  const restaurant = target.closest('.card-restaurant');

  if(restaurant)
  {
    containerPromo.classList.add('hide')
    restaurants.classList.add('hide')
    menu.classList.remove('hide')

    cardsMenu.textContent = "";

    createCardGood();
    createCardGood();
    createCardGood();
    createCardGood();
    createCardGood();
    createCardGood();
  }

  
}


cartButton.addEventListener('click', toggleModal);

close.addEventListener('click', toggleModal);
 

cardsRestaurants.addEventListener('click', openGoods);

logo.addEventListener('click', function()
{
  containerPromo.classList.remove('hide')
  restaurants.classList.remove('hide')
  menu.classList.add('hide')
})

checkAuth();//вызываем один раз при первой загрузке страницы

createCardRestaurant();
createCardRestaurant();
createCardRestaurant();
createCardRestaurant();
createCardRestaurant();
createCardRestaurant();




