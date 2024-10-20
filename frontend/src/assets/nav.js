export function readNav() {
    const val = window.localStorage.getItem('nav');

    if (val) {
        return JSON.parse(val);
    }
    return
}
