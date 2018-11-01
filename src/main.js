import CreditCardField from './CreditCardField';

export {
    CreditCardField
};

function install(vue, options) {
    vue.component('credit-card-field', CreditCardField);
}

if (window && window.Vue) {
    window.Vue.use(install);
}

export default install;
