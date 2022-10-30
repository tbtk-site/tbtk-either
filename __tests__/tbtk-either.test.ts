import { Do, left, right } from "../src/tbtk-either";

test("rightを呼び出すと成功系のEitherが作成される。", (): void => {
  expect(right(1).isRight()).toEqual(true);
  expect(right(1).isLeft()).toEqual(false);
  expect(right(1).getRight()).toEqual(1);
});

test("leftを呼び出すと失敗系のEitherが作成される。", (): void => {
  expect(left(2).isRight()).toEqual(false);
  expect(left(2).isLeft()).toEqual(true);
  expect(left(2).getLeft()).toEqual(2);
});

test("rightにgetLeftを呼ぶとエラーが発生する。", (): void => {
  expect(() => {right(1).getLeft()}).toThrow("This Either is a right");
});

test("leftにgetRightを呼ぶとエラーが発生する。", (): void => {
  expect(() => {left(1).getRight()}).toThrow("This Either is a left");
});

test("Doを呼び出すと成功系の空オブジェクトの入ったEitherが作成される。", (): void => {
  expect(Do().isRight()).toEqual(true);
  expect(Do().isLeft()).toEqual(false);
  expect(Do().getRight()).toEqual({});
});

test("右系Eitherにswapを呼び出すと、その値を持った左系のEitherができる", (): void => {
  expect(right(1).swap().isLeft()).toEqual(true);
  expect(right(1).swap().getLeft()).toEqual(1);
});

test("左系Eitherにswapを呼び出すと、その値を持った右系のEitherができる", (): void => {
  expect(left(2).swap().isRight()).toEqual(true);
  expect(left(2).swap().getRight()).toEqual(2);
});

test("右系Eitherにfoldを呼び出すと、右側用の関数が呼ばれて値が帰ってくる", (): void => {
  expect(right<number, number>(1).fold(a => a * 10, b => b * 100)).toEqual(100);
});

test("左系Eitherにfoldを呼び出すと、左側用の関数が呼ばれて値が帰ってくる", (): void => {
  expect(left<number, number>(1).fold(a => a * 10, b => b * 100)).toEqual(10);
});

test("右系EitherにgetOrElseを呼び出すと、右系の値がそのまま戻ってくる。", (): void => {
  expect(right(1).getOrElse(2)).toEqual(1);
});

test("左系EitherにgetOrElseを呼び出すと、引数の値がそのまま戻ってくる。", (): void => {
  expect(left(1).getOrElse(2)).toEqual(2);
});

test("右系EitherにorElseを呼び出すと、右系のEihterがそのまま戻ってくる。", (): void => {
  expect(right(1).orElse(left(2)).getRight()).toEqual(1);
});

test("左系EitherにorElseを呼び出すと、引数のEitherがそのまま戻ってくる。", (): void => {
  expect(left(1).orElse(right(2)).getRight()).toEqual(2);
});

test("右系EitherにgetOrElseFuncを呼び出すと、右系の値がそのまま戻ってくる。", (): void => {
  expect(right(1).getOrElseFunc(() => 2)).toEqual(1);
});

test("左系EitherにgetOrElseFuncを呼び出すと、引数の値がそのまま戻ってくる。", (): void => {
  expect(left(1).getOrElseFunc(() => 2)).toEqual(2);
});

test("右系Eitherにmapを呼び出すと、右の値がマップされたEitherが帰ってくる", (): void => {
  expect(right(1).map(a => a * 10).getRight()).toEqual(10);
});

test("左系Eitherにmapを呼び出すと、元の値が戻ってくる。", (): void => {
  expect(left<number, number>(1).map(a => a * 10).getLeft()).toEqual(1);
});

test("右系Eitherにfilterを呼び出し、フィルタ関数がtrueを返すと、元のEitherが戻ってくる", (): void => {
  expect(right(1).filter(a => a === 1, 0).getRight()).toEqual(1);
});

test("右系Eitherにfilterを呼び出し、フィルタ関数がfalseを返すと、第二引数の値を持つ左系Eitherが戻ってくる", (): void => {
  expect(right(2).filter(a => a === 1, 0).getLeft()).toEqual(0);
});

test("左系Eitherにfilterを呼び出すと、元のEitherが戻ってくる。", (): void => {
  expect(left(1).filter(_ => true, 0).getLeft()).toEqual(1);
});

test("右系EitherにflatMapを呼び出すと、関数が返したEitherが戻ってくる", (): void => {
  expect(right<string, number>(1).flatMap(_ => left("新しい左")).getLeft()).toEqual("新しい左");
});

test("左系EitherにflatMapを呼び出すと、元の値が戻ってくる。", (): void => {
  expect(left(1).flatMap(_ => right("新しい右")).getLeft()).toEqual(1);
});

test("右系Eitherにcontainsを呼び出し、指定の引数と同じ値を持っていればtrueが戻ってくる", (): void => {
  expect(right(1).contains(1)).toEqual(true);
});

test("右系Eitherにcontainsを呼び出し、指定の引数と違う値を持っていればfalseが戻ってくる", (): void => {
  expect(right(1).contains(2)).toEqual(false);
});

test("左系Eitherにcontainsを呼び出すと、falseが戻ってくる。", (): void => {
  expect(left(1).contains(1)).toEqual(false);
});

test("右系Eitherにexistsを呼び出し、指定の関数がtrueを返せばtrueが戻ってくる", (): void => {
  expect(right(1).exists(a => a === 1)).toEqual(true);
});

test("右系Eitherにexistsを呼び出し、指定の関数がfalseを返せばfalseが戻ってくる", (): void => {
  expect(right(2).exists(a => a === 1)).toEqual(false);
});

test("左系Eitherにexistsを呼び出すと、falseが戻ってくる。", (): void => {
  expect(left(1).exists(a => a === 1)).toEqual(false);
});

test("右系Eitherにforallを呼び出し、指定の関数がtrueを返せばtrueが戻ってくる", (): void => {
  expect(right(1).forall(a => a === 1)).toEqual(true);
});

test("右系Eitherにforallを呼び出し、指定の関数がfalseを返せばfalseが戻ってくる", (): void => {
  expect(right(2).forall(a => a === 1)).toEqual(false);
});

test("左系Eitherにforallを呼び出すと、trueが戻ってくる。", (): void => {
  expect(left(1).forall(a => a === 1)).toEqual(true);
});

test("ReadMeに記載の例が意図通りに動作する。", (): void => {
  const two_x = a => right(a * 2);
  const four_x = a => right(a * 4);
  const eight_x = a => right(a * 8);

  expect(
    right(2).flatMap(
    a => two_x(a).flatMap(
      b => four_x(a).flatMap(
        c => eight_x(a).map(
          d => `2x=${b}, 4x=${c}, 8x=${d}`
        )
      )
    )).getRight()
  ).toEqual("2x=4, 4x=8, 8x=16");
});

test("doとbindのdo版が例の意図通りに動作する。", (): void => {
  const two_x = (a: number) => right(a * 2);
  const four_x = (a: number) => right(a * 4);
  const eight_x = (a: number) => right(a * 8);

  expect(
    Do()
      .bind("a", _ => right(2))
      .bind("b", m => two_x(m.a))
      .bind("c", m => four_x(m.a))
      .bind("d", m => eight_x(m.a))
      .map(m => `2x=${m.b}, 4x=${m.c}, 8x=${m.d}`)
      .getRight()
  ).toEqual("2x=4, 4x=8, 8x=16");
});

test("doとbindのdo版で途中でエラーにしても意図通りに動作する。", (): void => {
  const two_x = (a: number) => right(a * 2);
  const four_x = (a: number) => left("エラー");
  const eight_x = (a: number) => right(a * 8);

  expect(
    Do()
      .bind("a", _ => right(2))
      .bind("b", m => two_x(m.a))
      .bind("c", m => four_x(m.a))
      .bind("d", m => eight_x(m.a))
      .map(m => `2x=${m.b}, 4x=${m.c}, 8x=${m.d}`)
      .getLeft()
  ).toEqual("エラー");
});


test("ReadMeの使い方デモがイメージ通りに動く。", (): void => {
  function beDivByTen(a) {
      return (a === 0) ? left("division by zero") : right(10 / a);
  }

  let a = beDivByTen(2);
  let e = beDivByTen(0);
  expect(a.getRight()).toEqual(5);
  expect(e.getLeft()).toEqual("division by zero");
});