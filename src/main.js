import CreditCardField from './CreditCardField';

export {
    CreditCardField
};

function install(vue, options) {
    window.Vue && window.Vue.component('credit-card-field', CreditCardField);
}

if (window && window.Vue) {
    window.Vue.use(install);
}

export default install;
