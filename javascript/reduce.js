// reduceメソッドの再発明
function myReduce(array, callback, initialValue) {
  // accumulatorの初期値がundefinedの場合は、配列の初期値の値をaccumulatorの値とする。
  // 初期値が渡ってきた場合は初期値をaccumulatorの値とする。
  // accumulatorは累積機という意味の英単語
  // TODO: 内容的にリファクタできそうなので試す
  let accumulator = initialValue === undefined ? array[0] : initialValue;

  // 開始位置。初期値が渡ってこない場合は1番目からスタート。
  // 初期値がある場合は初期値のある0番目からスタート。
  let startIndex = initialValue === undefined ? 1 : 0;

  // 結局低レイヤーはfor文で実装している
  // パフォーマンスの問題、HOCを使うと依存関係が複雑になる
  // HOCの強みは宣言的でコードリーディングしやすいこと
  // 低レイヤーまで降りるとforループで実装することになる。
  // 開始位置から要素の個数分ループする
  for (let i = startIndex; i < array.length; i++) {
    // callback関数=ユーザーが定義した関数を実行する
    // その引数には前回までの値を持ったaccumulator、現在の配列の要素、現在のインデックス、渡ってきた配列全体
    accumulator = callback(accumulator, array[i], i, array);
  }

  // 渡ってきた配列全部に対して、渡ってきた関数を実行して、累積値を返す
  return accumulator;
}
