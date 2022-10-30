## What is this?

This is a TypeScript implementation of the so-called Either.

There are plenty of such libraries on the Web, but I could not find one with an API that was easy for me to use, so I created my own.

## Install

```bash
# npm
npm install @tbtk-site/tbtk-either

# yarn
yarn add @tbtk-site/tbtk-either
```

Using jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/@tbtk-site/tbtk-either/dist/index.min.js"></script>
```

## How to use

Please refer to the test case for detailed usage.

```typescript
import { left, right } from "@tbtk-site/tbtk-either";

function beDivByTen(a) {
    return (a === 0) ? left("division by zero") : right(10 / a);
}

let a = beDivByTen(2);
let e = beDivByTen(0);
console.log(a.getRight()); // 5
console.log(e.getLeft());  // division by zero

```

## DO notation style

Haskell has a syntax called DO notation, which allows you to glue monadic chains in a way that all intermediate results can be used.
This library provides Do and bind to write Either chains in a similar way.

As an example, a function that doubles a number, a function that multiplies a number by 4, and a function that multiplies a number by 8 may all fail.

Suppose you have a "function that converts all intermediate results into strings" and want to call them by connecting them in a method chain.

If you don't want the intermediate result, you can just method chain the flatMap, but this time it's what you want.
I think that if you write this with flatMap naively, it will be nested as follows.

```typescript
const two_x = a => right(a * 2);
const four_x = a => right(a * 4);
const eight_x = a => right(a * 8);

right(2).flatMap(
  a => two_x(a).flatMap(
    b => four_x(a).flatMap(
      c => eight_x(a).map(
        d => `2x=${b}, 4x=${c}, 8x=${d}`
      )
    )
  )
).getRight();
```

It is not easy to read at all. This is what happens when you use Do and bind.

```typescript
const two_x = (a: number) => right(a * 2);
const four_x = (a: number) => right(a * 4);
const eight_x = (a: number) => right(a * 8);

Do()
  .bind("a", _ => right(2))
  .bind("b", m => two_x(m.a))
  .bind("c", m => four_x(m.a))
  .bind("d", m => eight_x(m.a))
  .map(m => `2x=${m.b}, 4x=${m.c}, 8x=${m.d}`)
  .getRight(); // 2x=4, 4x=8, 8x=16
```

Nesting is eliminated, which is beautiful. Naturally, even in Do, if left is reached in the middle of the process, subsequent processing is terminated.

```typescript
const two_x = (a: number) => right(a * 2);
const four_x = (a: number) => left("Error"); // Failed
const eight_x = (a: number) => right(a * 8);

Do()
  .bind("a", _ => right(2))
  .bind("b", m => two_x(m.a))
  .bind("c", m => four_x(m.a))
  .bind("d", m => eight_x(m.a)) // Not called
  .map(m => `2x=${m.b}, 4x=${m.c}, 8x=${m.d}`) // Not called
  .getLeft(); // Error
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
