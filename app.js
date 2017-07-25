let tipArray;
const main = document.querySelector('main');

/**
 * --------------------VIew (UI manipulation)-------------------
 */

function initView() {
  const baseMainTemplate = (`<h1>Hello World</h1>
    <div class="img-bcg">
      <div class="hello">
      </div>
    </div>
    <p>Add tips:</p>
    <form id="tip-form">
      <input placeholder="Add here" required>
      <button class="add-tip-btn">Submit</button>
    </form>`);

  main.innerHTML = baseMainTemplate;
  main.querySelector('#tip-form').addEventListener('submit', handelNewTip);
  main.querySelector('.hello').addEventListener('click', showTips);
}

function initTips() {
  const displayTip = localStorage.getItem('hideTips') !== 'true' ? true : false;
  const chances = Math.round(Math.random() * 100);

  if (displayTip && chances % 2 === 0) {
    showTips();
  }
}

function showTips() {
  const tipTemplate = (`<section>
      <div class="tip-box">
        <button type="button" id="close">X close</button>
        <h2>Tip Of The Day</h2>
        <p id="tip-text"></p>
        <div class="buttons">
          <button type="button" id="next">Next Tip</button>
          <button type="button" id="no-more">Don't Show Again</button>
        </div>
      </div>
    </section>`);
  const selectedTip = tipArray[Math.floor(Math.random() * tipArray.length)];
  const tipIndex = tipArray.findIndex((item) => item === selectedTip);

  main.innerHTML += tipTemplate;

  const tipTextElement = main.querySelector('#tip-text');

  main.querySelector('#close').addEventListener('click', initView);
  main.querySelector('#next').addEventListener('click', nextTipDisplay);
  main.querySelector('#no-more').addEventListener('click', noMoreTipDisplay);
  tipTextElement.setAttribute('tip-index', tipIndex);
  tipTextElement.innerText = selectedTip;
}

function noMoreTipDisplay() {
  localStorage.setItem('hideTips', 'true');
  initView()
}

function nextTipDisplay() {
  const tipTextElement = main.querySelector('#tip-text');
  const oldTipIndex = parseInt(tipTextElement.getAttribute('tip-index'));
  const nextTip = (oldTipIndex + 1) % tipArray.length;
  tipTextElement.setAttribute('tip-index', nextTip);
  tipTextElement.innerText = tipArray[nextTip];
}

initView();

/**
 * ---------------------Model (data manipulation)-------------------------
 */

function getTipsData() {
  if (localStorage.getItem('tipArray')) {
    tipArray = JSON.parse(localStorage.getItem('tipArray'));
    return initTips();
  }
  else {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', xhrLoadHandler);
    xhr.addEventListener('error', xhrErrorHandler);
    xhr.addEventListener('timeout', xhrTimeoutHandler);

    xhr.open('GET', 'tips.json');
    xhr.send();
  }
}

function setXhrInfoDisplay() {
  const infoTemplate = `<section>
      <div class="tip-box">
        <button type="button" id="close">X close</button>
        <h2></h2>
      </div>
    </section>`;

  main.innerHTML += infoTemplate;
  main.querySelector('#close').addEventListener('click', initView);
}

function xhrErrorHandler() {
  setXhrInfoDisplay();
  const infoMsgElem = main.querySelector('.tip-box').querySelector('h2');
  infoMsgElem.innerText = "Sadly, the tip of the day could not load";
}

function xhrTimeoutHandler() {
  setXhrInfoDisplay();
  const infoMsgElem = main.querySelector('.tip-box').querySelector('h2');
  infoMsgElem.innerText = "The server request to get the tips of the day was timed out";
}

function xhrLoadHandler(e) {
  const myXhr = e.target;

  tipArray = JSON.parse(myXhr.response);
  localStorage.setItem('tipArray', JSON.stringify(tipArray));
  initTips();
}

function handelNewTip(e) {
  e.preventDefault();
  const target = e.target;
  const inputElem = target.querySelector('input');
  const newTip = inputElem.value;
  tipArray.push(newTip);
  localStorage.setItem('tipArray', JSON.stringify(tipArray));
  inputElem.value = '';
}

getTipsData();