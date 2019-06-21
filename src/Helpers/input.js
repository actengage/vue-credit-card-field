export default function input(el) {
    return el.querySelector('input, textarea, select') || el;
}