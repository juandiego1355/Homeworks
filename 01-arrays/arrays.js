const frutas = ["manzana", "banano", "mango", "uva"];
console.log(frutas[0]);

// PUSH agrega un elemento al final del array

const numeros = [1,2,3];

numeros.push(4);

console.log(numeros);

// POP elimina el último elemento del array

const numeros = [1,2,3];

numeros.pop();

console.log(numeros);

// SHIFT elimina el primer elemento del array

const frutas = ["manzana", "banano", "mango", "uva"];

frutas.shift();

console.log(frutas);

// UNSHIFT agrega un elemento al inicio del array

const frutas = ["Banano", "Mango"];

frutas.unshift("manzana");

console.log(frutas);

// length devuelve la cantidad de elementos en el array

const frutas = ["manzana", "banano", "mango", "uva"];

console.log(frutas.length);

// includes devuelve true si el elemento existe en el array, de lo contrario devuelve false

const frutas = ["manzana", "banano", "mango", "uva"];

console.log(frutas.includes("mango"));
console.log(frutas.includes("pera"));

// indexOf devuelve el índice del elemento en el array, si no existe devuelve -1

const frutas = ["manzana", "banano", "mango", "uva"];

console.log(frutas.indexOf("mango"));

// slice devuelve una copia de una parte del array, sin modificar el array original

const frutas = ["manzana", "banano", "mango", "uva"];

console.log(frutas.slice(1,3));

// splice elimina elementos del array y opcionalmente agrega nuevos elementos

const frutas = ["manzana", "banano", "mango", "uva"];

frutas.splice(1, 1, "pera");

console.log(frutas);

//reverse invierte el orden de los elementos en el array

const numeros = [1,2,3,4,5];

numeros.reverse();

console.log(numeros);

// sort ordena los elementos del array

const numeros = [3,1,4,2,5];

numeros.sort();

console.log(numeros);

// contact concatena dos o más arrays y devuelve un nuevo array

const frutas = ["manzana", "banano"];
const verduras = ["zanahoria", "lechuga"];

console.log(frutas.concat(verduras));

// join une todos los elementos del array en un string

const frutas = ["manzana", "banano", "mango", "uva"];

console.log(frutas.join(", "));

// forEach ejecuta una función para cada elemento del array

const frutas = ["manzana", "banano", "mango", "uva"];

frutas.forEach(function(fruta) {
  console.log(fruta);
});

// map crea un nuevo array con los resultados de la función aplicada a cada elemento del array

const numeros = [1,2,3,4,5];

const dobles = numeros.map(numero => numero * 2);

console.log(dobles);

// filter crea un nuevo array con los elementos que cumplan la condición de la función

const numeros = [1,2,3,4,5];

const pares = numeros.filter(numero => numero % 2 === 0);

console.log(pares);

//find devuelve el primer elemento que cumpla la condición de la función

const numeros = [1,2,3,4,5];

const primerPar = numeros.find(numero => numero % 2 === 0);

console.log(primerPar);

// some devuelve true si al menos un elemento cumple la condición de la función, de lo contrario devuelve false

const numeros = [1,2,3,4,5];

console.log(
numeros.some(numero => numero % 2 === 0)
)

// every devuelve true si todos los elementos cumplen la condición de la función, de lo contrario devuelve false

const numeros = [1,2,3,4,5];

console.log(
numeros.every(numero => numero > 0)
)

// reduce aplica una función a un acumulador y a cada elemento del array (de izquierda a derecha) para reducirlo a un único valor

const numeros = [1,2,3,4,5];

const suma = numeros.reduce((acumulador, numero) => acumulador + numero, 0);

console.log(suma);