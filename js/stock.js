let stock = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch('./complectations.json')
    .then(response => response.json())
    .then(data => stock = Object.values(data))
    .then(() => console.log(stock))
    .then(() => addComplictations());
});

function addComplictations() {
  // Логика для показа комплектаций
  const RenderPoints = {
    AFTERBEGIN: 'afterbegin',
    BEFOREEND: 'beforeend',
  };

  const defaultImgPath = '/img/cars/';

  const getRandomInteger = (a = 0, b = 1) => {
    const lower = Math.ceil(Math.min(a, b));
    const upper = Math.floor(Math.max(a, b));

    return Math.floor(lower + Math.random() * (upper - lower + 1));
  };

  const render = (container, content, point = RenderPoints.BEFOREEND) => {
    container.insertAdjacentHTML(point, content);
  };

  const format = (value) => {
    var point = "";

    var x = String(value).replace(/(\.|,)\d+/, function (m) {
      point = m;
      return "";
    });

    x = x.split("").reverse().join("")
      .replace(/(\d{3})/g, "$1 ")
      .split("").reverse().join("");

    return x + point;
  }

  const createDropItem = (type, data) => `<li class="dropdown__list-item" data-${type}="${data}">${data}</li>`;

  const createComplCard = (car, complictation, imgPath) => {
    let months = 7 * 12;
    let icredit = (4.5 / 12) / 100;
    let creditPay = format(Math.floor(((icredit * Math.pow((1 + icredit), months)) / (Math.pow((1 + icredit), months) - 1)) * complictation.new_cost));

    return `
  <div class="complictation">
    <div class="complictation__img">
      <img src="${imgPath}.webp" alt="${car}">
    </div>
    <div class="complictation__description">
      <div class="mb-0 mb-md-4">
        <span class="complictation__engine">${complictation.engine}</span>&nbsp;
        <span class="complictation__name">${complictation.name}</span>
      </div>
      <div class="ms-3 ms-md-0">
        <span class="complictation__kpp">${complictation.kpp}</span>&nbsp;
        <span class="complictation__power">${complictation.power}&nbsp;л.с.</span>
      </div>
    </div>
    <div class="complictaton__benefits">
      <div class="complictation__costs">
        <span class="complictation__old-cost">${complictation.old_cost.toLocaleString()}&nbsp;₽</span>
        <span class="complictation__new-cost">${complictation.new_cost.toLocaleString()}&nbsp;₽</span>
      </div>
      <ul class="d-none d-md-block">
        <li class="complictaton__benefits-item">— Кредит от&nbsp;7.4% годовых.</li>
        <li class="complictaton__benefits-item">— Особые условия при&nbsp;покупке в&nbsp;Trade&nbsp;in.</li>
      </ul>
    </div>
    <div class="complictation__buttons">
      <button class="btn btn--transparent" type="button" data-bs-toggle="modal" data-bs-target="#creditModal">Купить в кредит</button>
      <button class="btn complictation__btn--gray" type="button" data-bs-toggle="modal" data-bs-target="#offerModal">Получить предложение</button>
    </div>
  </div>`
  };

  const dropBtns = document.querySelectorAll('.dropdown__btn');
  const dropContent = document.querySelectorAll('.dropdown__content');
  const modelsList = document.querySelector('.models-list');
  const enginesList = document.querySelector('.engines-list');
  const complContainer = document.querySelector('.complictstions__list');
  const modelBtn = document.querySelector('.dropdown__btn[data-btn="model"]');
  const engineBtn = document.querySelector('.dropdown__btn[data-btn="engine"]');

  dropBtns.forEach((btn) => {
    btn.addEventListener('click', (evt) => {
      dropContent.forEach((item) => item.classList.remove('active'));
      evt.target.nextElementSibling.classList.add('active');
    });
  });

  //Close the dropdown if the user clicks outside of it
  window.onclick = (event) => {
    if (!event.target.matches('.dropdown__btn')) {
      dropContent.forEach((item) => item.classList.remove('active'));
    }
  }

  const renderModelsList = () => {
    stock.forEach((car) => {
      render(modelsList, createDropItem('model', car.model));
    });
  }

  const clearParent = (parent) => {
    parent.innerHTML = '';
  }

  renderModelsList();
  let currentCar = null;


  engineBtn.setAttribute('disabled', 'disabled');

  document.querySelectorAll('.models-list .dropdown__list-item').forEach((model) => {
    model.addEventListener('click', (evt) => {
      evt.preventDefault();
      let currentComplictations = [];
      let currentEngines = [];

      clearParent(complContainer);
      clearParent(enginesList);
      engineBtn.textContent = 'Двигатель';
      if (engineBtn.hasAttribute('disabled')) {
        engineBtn.removeAttribute('disabled');
      }

      stock.forEach((car) => {
        if (evt.target.textContent === car.model) {
          modelBtn.textContent = car.model;
          currentCar = car.model;
          car.complictations.forEach((complictation) => {
            render(complContainer, createComplCard(car.model, complictation, `${defaultImgPath + car.model + '/' + getRandomInteger(1, 4)}`));
            currentComplictations.push(complictation);
            let k = true;
            if (currentEngines.length === 0) {
              currentEngines.push(complictation.engine);
            } else {
              currentEngines.forEach((engine) => {
                if (engine === complictation.engine) {
                  k = false;
                }
              });
              if (k) {
                currentEngines.push(complictation.engine);
              }
            }
          });
        }
      });

      // Рендерим список двигателей
      currentEngines.forEach((engine) => {
        render(enginesList, createDropItem('engine', engine));
      });

      document.querySelectorAll('.engines-list .dropdown__list-item').forEach((item) => {
        item.addEventListener('click', (event) => {
          event.preventDefault();
          clearParent(complContainer);
          currentComplictations.forEach((compl) => {
            if (event.target.textContent === compl.engine) {
              render(complContainer, createComplCard(currentCar, compl, `${defaultImgPath + currentCar + '/' + getRandomInteger(1, 4)}`));
              engineBtn.textContent = compl.engine;
            }
          });
        });
      });
    });
  });
};