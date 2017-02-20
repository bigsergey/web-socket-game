import './style.scss';

const {x, y, ...z} = {x: 1, y: 2, a: 3, b: 4};
const n = {x, y, ...z};
if (Object.keys(n).map((key) => n[key]).reduce((p,v) => p + v) === 10) {
  document.querySelector('#app').insertAdjacentHTML('afterbegin', '<h1>works.</h1>');
}
