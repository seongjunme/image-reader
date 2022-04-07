import App from './layout/App';
import './style.scss';

const $app = document.querySelector('#app');
if ($app) App({ $app }).render();
