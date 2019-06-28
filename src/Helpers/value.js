export default function value(subject) {
    if(subject instanceof Function) {
        return subject();
    }

    return subject;
}