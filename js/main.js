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
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag')


let login = localStorage.getItem('Delivery');
//функция открытия/закрытия модального окна

const cart = [];

// функция запрос на сервер
const getData = async function(url)
{
  const response = await fetch(url);

  if(!response.ok)
  {
    throw new Error(`Address error${url}, 
    status error ${response.status}!`)
  }
  return await response.json();
}


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
  buttonOut.style.display = 'flex';//отоброжается кнопка выйти
  cartButton.style.display = 'flex'
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

function createCardRestaurant({ image, kitchen, name, price, stars, products,
  time_of_delivery })
{
  const card = `
  <a class="card card-restaurant" data-products = "${products}">
    <img src="${image}" alt=tanuki class="card-image"/>
        <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${time_of_delivery}</span>
        </div>
        <div class="card-info">
          <div class="rating">
            ${stars}
          </div>
          <div class="price">${price}</div>
          <div class="category">${kitchen}</div>
        </div>
    </div>
</a>
`;
  cardsRestaurants.insertAdjacentHTML("afterbegin", card);

}


function createCardGood({ description, id, image, name, price })
{
  const card = document.createElement('div');
  card.className = 'card';
  


  card.insertAdjacentHTML("beforeend", `
  
  <img src="${image}" alt="image" class="card-image"/>
  <div class="card-text">
    <div class="card-heading">
      <h3 class="card-title card-title-reg">${name}</h3>
    </div>
    <div class="card-info">
      ${description}
    </div>
    <div class="card-buttons">
      <button class="button button-primary button-add-cart" id = "${id}">
        <span class="button-card-text">Cart</span>
        <span class="button-cart-svg"></span>
      </button>
      <strong class="card-price card-price-bold">${price}</strong>
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
    
    cardsMenu.textContent = "";
    containerPromo.classList.add('hide')
    restaurants.classList.add('hide')
    menu.classList.remove('hide')

   getData(`./db/${restaurant.dataset.products}`).then(function(data)
   {
     data.forEach(createCardGood);
   })

    
  }

  
}

//добавление в корзину
function addToCart(event)
{
    const target = event.target;
    const buttonAddToCart = target.closest('.button-add-cart');
    if(buttonAddToCart)
    {
      const card = target.closest('.card');
      const title = card.querySelector('.card-title-reg').textContent;//текс контент позволяет вывести только содержимое в виде текста
      const cost = card.querySelector('.card-price').textContent;
      const id = buttonAddToCart.id;

      //функция вернет значение если айди будет дублироваться а на count будет прибавляться
      const food = cart.find(function(item)//файнд ищет в массиве совпадение по условию
      {
          return item.id === id
      })
      
      if(food)
      {
        food.count +=1;
      }
      else
      {
        cart.push({
          id: id,
          title: title,
          cost: cost,
          count: 1
        })
      }
      
      
    }
}

//рендер карзины
function renderCart()
{
  modalBody.textContent = '';

  cart.forEach(function({ id, title, cost, count })
  {
    const itemCart = `
    <div class="food-row">
					<div class="span food-name">${title}</div>
					<strong class="food-price">${cost}</strong>
					<div class="food-counter">
						<button class="counter-button">-</button>
						<span class="counter">${count}</span>
						<button class="counter-button">+</button>
					</div>
		</div>
    `;
    modalBody.insertAdjacentHTML('afterbegin', itemCart)

  })

  const totalPrice = cart.reduce(function(result, item) {
     return result + (parseFloat(item.cost) * item.count);
    }, 0)

    modalPrice.textContent = totalPrice;
}



//вызов функций
function init()
{
    getData('./db/partners.json').then(function(data)
    {
        data.forEach(createCardRestaurant);
    });

    cartButton.addEventListener('click', function(){
      renderCart();
      toggleModal();

    });

    cardsMenu.addEventListener('click', addToCart);//обработчик событий в меню карточек

    close.addEventListener('click', toggleModal);
    

    cardsRestaurants.addEventListener('click', openGoods);

    logo.addEventListener('click', function()
    {
      containerPromo.classList.remove('hide')
      restaurants.classList.remove('hide')
      menu.classList.add('hide')
    })

    checkAuth();//вызываем один раз при первой загрузке страницы
}

init();


