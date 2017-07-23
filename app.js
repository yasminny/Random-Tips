let tipArray;

function initTips() {
  const displayTip = localStorage.getItem('hideTips') ? false : true;
  const tipTextElement = document.getElementById('tip-text');
  const selectedTip = tipArray[Math.floor(Math.random() * tipArray.length)];
  const chances = Math.round(Math.random() * 100);
  const tipBoxElem = document.querySelector('.tip-box');
  const closeBtn = document.getElementById('close');
  const nextBtn = document.getElementById('next');
  const noMoreTipsBtn = document.getElementById('no-more');
  const tipIndex = tipArray.findIndex((item) => item === selectedTip);

  tipTextElement.setAttribute('tip-index', tipIndex);
  closeBtn.addEventListener('click', closeTipDisplay);
  nextBtn.addEventListener('click', nextTipDisplay);
  noMoreTipsBtn.addEventListener('click', noMoreTipDisplay);
  tipTextElement.innerText = selectedTip;

  if (displayTip && chances % 2 === 0) {
    tipBoxElem.classList.remove('hide');
  }
}

function closeTipDisplay() {
  const tipBoxElem = document.querySelector('.tip-box');
  return tipBoxElem.classList.add('hide');
}

function noMoreTipDisplay() {
  localStorage.setItem('hideTips', true);
  closeTipDisplay();
}

function nextTipDisplay() {
  const tipTextElement = document.getElementById('tip-text');
  const oldTipIndex = parseInt(tipTextElement.getAttribute('tip-index'));
  let nextTip;
  if (oldTipIndex === tipArray.length - 1) {
    nextTip = tipArray[0];
  }
  else {
    nextTip = tipArray[oldTipIndex + 1];
  }
  const tipIndex = tipArray.findIndex((item) => item === nextTip);
  tipTextElement.setAttribute('tip-index', tipIndex);
  tipTextElement.innerText = nextTip;
}

function getTipsData() {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', xhrLoadHandler);

  xhr.open('GET', 'tips.json');
  xhr.send();
}

function xhrLoadHandler(event) {
  const myXhr = event.target;

  tipArray = JSON.parse(myXhr.response);
  initTips();
}

getTipsData();