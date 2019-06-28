import input from './input';

export default function attribute(el, attr, value) {
    input(el)[value ? 'setAttribute' : 'removeAttribute'](attr, value);
};