/**
 * いわゆるMaybeモナド的なクラスです。
 */
export class Either<L, R> {
  /**
   * 基本的にユーザが自分でコンストラクタを呼んではいけません。
   * インタフェース的に冗長なためです。
   *
   * {@link right}や{@link left}を使ってインスタンスを作成します。
   *
   * @param p_value 値
   * @param p_is_right 右系ならtrue、左系ならfalseを指定
   */
  constructor (p_value: L | R, p_is_right: boolean) {
    this.FValue = p_value;
    this.FIsRight = p_is_right;
  }

  /**
   * このインスタンスが右系かどうかを返します。
   *
   * @returns 右系ならtrue、そうでないならfalse
   */
  isRight(): boolean {
    return this.FIsRight;
  }

  /**
   * このインスタンスが左系かどうかを返します。
   *
   * @returns 左系ならtrue、そうでないならfalse
   */
  isLeft(): boolean {
    return !this.FIsRight;
  }

  /**
   * 右系のインスタンスとして、保持している値を取り出します。
   * 左系のインスタンスにこのメソッドを呼ぶと例外が発生します。
   *
   * @returns 現在保持している右系の値。
   */
  getRight(): R {
    if (this.isLeft()) {
      throw new Error("This Either is a left");
    }

    return this.FValue as R;
  }

  /**
   * 左系のインスタンスとして、保持している値を取り出します。
   * 右系のインスタンスにこのメソッドを呼ぶと例外が発生します。
   *
   * @returns 現在保持している左系の値。
   */
  getLeft(): L {
    if (this.isRight()) {
      throw new Error("This Either is a right");
    }

    return this.FValue as L;
  }

  /**
   * 現在値が右系である場合は保持している値を返し
   * 左系である場合は引数で指定した値を返します。
   *
   * @param p_failed_value 左系の時に返す値。
   * @returns 説明欄の通り
   */
  getOrElse(p_failed_value: R): R {
    return this.FIsRight ? this.FValue as R : p_failed_value;
  }

  /**
   * 現在値が右系である場合は保持している値を返し
   * 左系である場合は引数で指定した関数を呼び出して、その値を返します。
   *
   * @param p_failed_function 左系の時に呼び出す、引数を取らずに値を返す関数
   * @returns 説明欄の通り
   */
  getOrElseFunc(p_failed_function: () => R): R {
    return this.FIsRight ? this.FValue as R : p_failed_function();
  }

  /**
   * 現在値が右系ならこのインスタンスを
   * 左系の場合は引数で指定したEitherを返します。
   *
   * @param p_failed_either 左系の時に返すEither
   * @returns 説明欄の通り。
   */
  orElse(p_failed_either: Either<L, R>): Either<L, R> {
    return this.FIsRight ? this : p_failed_either;
  }

  /**
   * 現在値が右系の場合、現在値を取り、真偽値を返すフィルタ関数を呼び出します。
   * そのフィルタ関数が「true」を返した場合は、現在のインスタンスがそのまま戻ります。
   * フィルタ関数が「false」を返した場合、もう一つの引数の値を持つ左系のEitehrが戻ります。
   *
   * 最初から左系だった場合は、現在のインスタンスが戻ります。
   * @param p_filter 右系の値を取り、真偽値を返す関数
   * @param p_failed_value フィルタ関数がfalseを返した場合に作られる左系Eitherの値になる値。
   * @returns 説明欄の通り
   */
  filter(p_filter: (p: R) => boolean, p_failed_value: L): Either<L, R> {
    if (this.FIsRight) {
      return p_filter(this.FValue as R) ? this : new Either<L, R>(p_failed_value, false);
    }
    else {
      return this;
    }
  }

  /**
   * 右系Eitherを左系に、左系Eitherを右系にした新たなEitherを作ります。
   * @returns 左右逆転した新たなEitherのインスタンス
   */
  swap(): Either<R, L> {
    return new Either<R, L>(this.FValue, !this.FIsRight);
  }

  /**
   * 右系か左系かに合わせて指定の関数を呼び出し、その結果を取得します。
   * なお、関数の戻り値の型はどちらも同じにする必要があります。
   *
   * @param p_left_func 左系の時に呼ばれる、左系の値を引数にとり値を返す関数
   * @param p_right_func 右系の時に呼ばれる、右系の値を引数にとり値を返す関数
   * @returns 関数呼び出しの結果
   */
  fold<T>(p_left_func: (p: L) => T, p_right_func: (p: R) => T): T {
    return this.FIsRight ? p_right_func(this.FValue as R) : p_left_func(this.FValue as L);
  }

  /**
   * 現在値が右系である場合、右系の値を引数にとり値を返す指定の関数を呼び出して
   * その戻り値を右系の値とする新たなEitherを作ります。
   *
   * 現在値が左系である場合は、左系の値を保持した新たなEitherのインスタンスを作ります。
   *
   * @param p_map_func 右系の値をマップする関数
   * @returns 説明欄の通り
   */
  map<T>(p_map_func: (p: R) => T): Either<L, T> {
    return this.FIsRight
              ? new Either<L, T>(p_map_func(this.FValue as R), true)
              : new Either<L, T>(this.FValue as L, false);
  }

  /**
   * 現在値が右系である場合、右系の値を引数にとりEitherを返す指定の関数を呼び出して
   * その戻り値を返します。
   * 
   * 現在値が左系である場合は、左系の値を保持した新たなEitherのインスタンスを作ります。
   * 
   * @param p_map_func 
   *   右系の値を元に新たなEitherを作る関数。左系の型は現在と同じにする必要があります。
   * @returns 説明欄の通り
   */
  flatMap<T>(p_map_func: (p: R) => Either<L, T>): Either<L, T> {
    return this.FIsRight
              ? p_map_func(this.FValue as R)
              : new Either<L, T>(this.FValue as L, false);
  }

  /**
   * 現在値が右系である場合、現在値が引数指定の値かを「===」で比較し、その結果をそのまま返します。
   * 現在値が左系である場合は常にfalseを返します。
   *
   * @param p_test 比較値
   * @returns 説明欄の通り
   */
  contains(p_test: R) : boolean {
    return this.FIsRight ? this.FValue === p_test : false;
  }

  /**
   * 現在値が右系である場合、現在値を引数に取り真偽値を返す関数を呼び、その結果をそのまま返します。
   * 現在値が左系である場合は常にfalseを返します。
   *
   * @param p_filter 右系の値をとり、真偽値を返す関数
   * @returns 説明欄の通り
   */
  exists(p_filter: (p: R) => boolean): boolean {
    return this.FIsRight ? p_filter(this.FValue as R) : false;
  }

  /**
   * 現在値が右系である場合、現在値を引数に取り真偽値を返す関数を呼び、その結果をそのまま返します。
   * 現在値が左系である場合は常にtrueを返します。
   *
   * @param p_filter 右系の値をとり、真偽値を返す関数
   * @returns 説明欄の通り
   */
  forall(p_filter: (p: R) => boolean): boolean {
    return this.FIsRight ? p_filter(this.FValue as R) : true;
  }

  /**
   * do記法っぽいことをやるメソッドです。
   * 呼び出すたびに、戻り値がObjectに集約されていくため{@link flatMap}のネストを見やすく書き下せます。
   *
   * 具体的には以下の使い方例を参照ください。
   *
   */
  bind<K extends string, T>(p_key: K, p_flatmap: (p: R) => Either<L, T>): Either<L, R & {[p_key in K]: T}> {
    return this.flatMap(a =>                              // 今がleftならそれを返し、そうでないならば
      p_flatmap(a).map(b =>                               // 今のObject値を引数に「p_flatmap」を呼び出して、その結果を得て
        ({...a, ...({[p_key]: b}) as {[p_key in K]: T}})  // その結果がleftならそれを返し、そうでないなら今のObjectに「p_key」の値をキーに持つObjectを足して返す
      )
    );
  }

  private FIsRight: boolean;
  private FValue: L | R;
}

/**
 * 右(成功)系の{@link Either}を作ります。
 *
 * @param p_value 成功系の値。
 * @returns Either のインスタンス
 */
export function right<L, R>(p_value: R) : Either<L, R> {
  return new Either<L, R>(p_value, true);
}

/**
 * 左(失敗)系の{@link Either}を作ります。
 *
 * @param p_value 失敗系の値。
 * @returns Either のインスタンス
 */
export function left<L, R>(p_value: L) : Either<L, R> {
  return new Either<L, R>(p_value, false);
}

/**
 * 内部に空オブジェクトを持つ右系の{@link Either}を作ります。
 * 基本的にDo記法もどきの起点なので、この後に「{@link Either.bind}」をつなげていく形になります。
 *
 * @returns 空オブジェクトを成功系の値に持つEitherのインスタンス
 */
export function Do<L>() : Either<L, {}> {
  return right<L, {}>({});
}
