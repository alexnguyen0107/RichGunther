import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './assets/sass/style.scss';
import App from './components/App';
// import './assets/js/script'
// import './assets/js/game-page'
// import i18n (needs to be bundled ;))
import './i18n';
import * as serviceWorker from './serviceWorker';
import configureStore from './store/configureStore';
import { STORAGE_KEYS } from './utils/constants';

axios.interceptors.request.use(
    (req) => {
       // Add configurations here
       req.timeout = 40000;
       return req;
    },
    (err) => {
       return Promise.reject(err);
    }
 );
 

axios.interceptors.response.use(
    // config => {
    //     console.log('httpClient', config);
    // },
    (response) => {
        return response;
    },
    (error) => {
        if (error.code === 'ECONNABORTED') {
            alert('Hệ thống gián đoạn. Vui lòng thử lại sau');
            window.location.reload();
        }
        if (error.response.status === 401) {
            alert('Session timeout. You are must be authorized');
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            window.location.href = '/login';
        }
        return Promise.reject(error.response);
    }
);

ReactDOM.render(
    <Provider store={configureStore()}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
