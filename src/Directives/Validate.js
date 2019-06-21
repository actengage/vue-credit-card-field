import validator from 'card-validator';

const METHODS = {
    'cvc': 'cvv',
    'zip': 'postalCode',
    'date': 'expirationDate',
    'year': 'expirationYear',
    'month': 'expirationMonth'
};

export default {

    bind(el, binding, vnode) {
        const method = validator[binding.arg] || validator[METHODS[binding.arg]];

        if(!binding.arg || !method) {
            throw Error('An argument with a valid method is required for v-validate.');
        }

        let prevValue;

        function validate(e) {
            // As the input changed
            if(e.target.value !== prevValue) {
                const response = method(e.target.value, binding.value);
        
                if(response.isValid) {
                    el.dispatchEvent(new Event('valid'));
                }
                else if(!response.isPotentiallyValid) {
                    el.dispatchEvent(new Event('invalid'));
                }
            }
        
            prevValue = e.target.value;
        }

        el.addEventListener('blur', validate);
        el.addEventListener('keyup', validate);
        
    }

};