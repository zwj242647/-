// let str = parseInt(readline());
// let len = str.length;
// let num = 0;
// for (let i = 0; i < len; i++) {
//     if (str[i] === (str[i + 1] || str[i]) && str[i] === (str[i - 1] || str[i])) {
//         num++;
//     }
// }
// print(num);


// let str = parseInt(readline());
// let len = str.length;
// let num = 0;
// for (let i = 0; i < len; i++) {
//     if (str[i] === str[i + 1] && str[i] === str[i - 1]) {
//         num++;
//     }
// }
// str[0] === str[1]?num++:null;
// str[len-1] === str[len-2]?num++:null;

// print(num);


// let num = parseInt(readline());
// let result = num;
// for (let i = 1; i < num; i++) {
//     if (result % i != 0) {
//         result = i % 2 === 0 ? result * i : result * (i / 2);
//     }
// }
// print(result % 987654321);

let str = 'HHTHHH';
let len = str.length;
let num = 0;
for (let i = 0; i < len; i++) {
    if (str[i] !== (str[i + 1] || str[i]) || str[i] !== (str[i - 1] || str[i])) {
        num+=2;
        i++
    }
}
console.log(num)