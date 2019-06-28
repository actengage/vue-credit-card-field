export default function set(value) {
    binding.expression.split('.').reduce((carry, attr) => {
        if(vnode.context[attr] instanceof Object) {
            return vnode.context[attr];
        }
        else {
            vnode.context.$set(carry, attr, value);        
        }
    }, null);
}
        