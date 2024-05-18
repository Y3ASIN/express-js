const text = '01752551209';
const regex = /(\+88)?-?01[0-9]\d{8}/gi;

const matches = text.match(regex);

const index = text.search(regex);

const replaced = text.replace(regex, 'phone');

console.log(matches, index, replaced);
