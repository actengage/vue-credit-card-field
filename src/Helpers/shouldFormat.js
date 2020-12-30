export default function shouldFormat(e) {
    return (
        !e.altKey &&
        !e.ctrlKey &&
        !e.metaKey && 
        !e.shiftKey
    );
};
