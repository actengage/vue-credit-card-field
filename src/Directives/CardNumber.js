import { attribute } from '../Helpers';
import { creditCardType } from 'card-validator';

export default {

    bind(el) {
        let prevValue;

        el.addEventListener('card-types', ({ target, types }) => {
            const [ type ] = types;
            
            attribute(el, 'maxlength', type && (type.gaps.length + type.lengths.pop()));
        });

        el.addEventListener('keyup', e => {
            const types = e.target.value ? creditCardType(e.target.value) : [], [ type ] = types;

            event = new Event('card-types');
            event.types = types;

            if(e.target.value !== prevValue) {
                el.dispatchEvent(event);
            }

            prevValue = e.target.value;
        });

    }

};