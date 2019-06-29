import validator from 'card-validator';
import { input, value, shouldFormat } from '../Helpers';

const METHODS = {
    'cvc': 'cvv',
    'zip': 'postalCode',
    'date': 'expirationDate',
    'year': 'expirationYear',
    'month': 'expirationMonth'
};

validator.name = function name(value) {
    const isValid = value && value.length;
    const isPotentiallyValid = isValid || !value;

    return {
        isValid,
        isPotentiallyValid
    };
};

export default {

    bind(el, binding, vnode) {
        const method = validator[binding.arg] || validator[METHODS[binding.arg]];

        if(!binding.arg || !method) {
            throw Error('An argument with a valid method is required for v-validate.');
        }

        let prevValue;

        function get() {
            return binding.expression.split('.').reduce((carry, attr) => {
                return carry[attr];
            }, vnode.context);
        }

        function set(value) {
            binding.expression.split('.').reduce((carry, attr) => {
                if(vnode.context[attr] instanceof Object) {
                    return vnode.context[attr];
                }
                else {
                    vnode.context.$set(carry, attr, value);        
                }
            }, null);
        }
                
        function validate(force = false) {
            return e => {
                if( shouldFormat(e) && 
                    !!e.target.value && 
                    (e.target.value !== prevValue || force)) {
                        
                    dispatch(e.target.value, force);
                    
                    prevValue = e.target.value;
                }            
            };
        }
        
        function dispatch(str, force = false) {
            const response = method(str, value(vnode.data.attrs.validator));
                  
            if(!response.isValid && (!response.isPotentiallyValid || force)) {
                el.dispatchEvent(new Event('invalid'));
            }
            else if(response.isValid) {
                el.dispatchEvent(new Event('valid'));
            }
            else if(response.isPotentiallyValid) {
                el.dispatchEvent(new Event('potentially-valid'));
            }
            
            el.dispatchEvent(Object.assign(new Event('validate'), {
                response
            }));
        }

        const inputEl = input(el);

        inputEl.addEventListener('paste', () => {
            setTimeout(() => {
                dispatch(inputEl.value);
            });
        });

        inputEl.addEventListener('revalidate', dispatch);
        inputEl.addEventListener('blur', validate(true));

        if(inputEl.tagName === 'SELECT') {
            inputEl.addEventListener('change', e => {
                set(null);

                setTimeout(() => {
                    dispatch(inputEl.value);
                });
            });
        }
        else {
            inputEl.addEventListener('keyup',  validate());
        }

        inputEl.addEventListener('keydown', e => {
            if(shouldFormat(e)) {
                prevValue = e.target.value;
            }
        });
        
        el.addEventListener('valid', e => set(true));
        el.addEventListener('invalid', e => set(false));
        el.addEventListener('potentially-valid', e =>  set(null));

        el.addEventListener('validate', ({ response }) => {
            vnode.componentInstance.$emit('validate', el, response, get());
        });

        if(inputEl.value) {
            if(get() !== false) {
                set(null);

                dispatch(inputEl.value);
            }
        }
    }

};