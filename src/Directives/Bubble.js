import { input } from "../Helpers";

export default {

    bind(el, { arg, value }, vnode) {
        input(el).addEventListener(arg, e => {
            if(value instanceof Function) {
                value(e);
            }

            vnode.context.$emit(arg, e);
        });
    }

}