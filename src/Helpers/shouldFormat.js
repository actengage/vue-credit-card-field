const ZERO_KEY_CODE = 48;
const NINE_KEY_CODE = 57;

export default function shouldFormat(e) {
    return (
        (
            !e.keyCode ||
            ZERO_KEY_CODE <= e.keyCode && 
            NINE_KEY_CODE >= e.keyCode
        ) &&
        !e.ctrlKey &&
        !e.metaKey && 
        !e.shiftyKey
    );
};