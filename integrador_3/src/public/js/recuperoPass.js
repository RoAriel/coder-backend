const input_string = window.location.href

let url = new URL(input_string);
let token = url.searchParams.get('tk');


console.log('URL:', url);
console.log('TOKEN:', token);

