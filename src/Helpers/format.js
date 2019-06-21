export default function format(cardNumber, types) {
    if(!cardNumber || !types) {
        return cardNumber;
    }

    const parts = [], { gaps } = types;
    const offsets = [].concat(0, gaps, cardNumber.length);

    for(let i = 0; offsets[i] < cardNumber.length; i++) {
        const start = offsets[i];
        const end = Math.min(offsets[i + 1], cardNumber.length);
        
        parts.push(cardNumber.substring(start, end));
    }

    return parts.join(' ');
};