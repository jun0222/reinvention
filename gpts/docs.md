`useEffect` と `useMemo` の基本的な仕組みを理解するためには、React の内部でどのようにこれらが動作しているかに注目し、シンプルなカスタムフックを実装してみると良いです。

まずはそれぞれの役割を確認しましょう。

### `useEffect`

`useEffect` は、コンポーネントがレンダーされた後に副作用（データのフェッチ、DOM の操作、サブスクリプションの設定など）を実行するためのものです。依存関係が変更された場合に再実行されます。

### `useMemo`

`useMemo` は、重い計算処理を依存関係が変更されたときだけ再計算するためのものです。結果がメモ化され、パフォーマンスの最適化に役立ちます。

それでは、まずこれらを自分でシンプルに実装してみます。

### 自作の `useEffect`

`useEffect` を簡単に模倣するには、関数と依存配列を受け取り、依存配列が変わったときに関数を実行するようにすれば良いです。

```javascript
function useCustomEffect(callback, deps) {
  const hasMounted = useRef(false);
  const prevDeps = useRef(deps);

  useEffect(() => {
    if (hasMounted.current) {
      // 依存関係が変わった場合だけ callback を実行
      if (!areDepsEqual(prevDeps.current, deps)) {
        callback();
        prevDeps.current = deps;
      }
    } else {
      // 初回レンダリングでは副作用を実行
      callback();
      hasMounted.current = true;
    }
  }, deps);
}

function areDepsEqual(oldDeps, newDeps) {
  return oldDeps.every((dep, i) => dep === newDeps[i]);
}
```

### 自作の `useMemo`

`useMemo` の仕組みも、依存関係が変わらない限り再計算しないという点がポイントです。以下のように実装できます。

```javascript
function useCustomMemo(factory, deps) {
  const memoizedValue = useRef();
  const prevDeps = useRef(deps);

  if (!areDepsEqual(prevDeps.current, deps)) {
    // 依存関係が変わった場合のみ再計算
    memoizedValue.current = factory();
    prevDeps.current = deps;
  }

  return memoizedValue.current;
}
```

これらの実装で重要な点は、**依存関係が変更されると再計算や副作用が発動する**ことです。`useRef` を使って以前の状態を保持し、`useEffect` を使ってコンポーネントのライフサイクルにフックすることで、React の機能を模倣しています。

試しに、これらのカスタムフックを使ってコンポーネントを作成してみてください。

その通りです！「副作用」という言葉は、プログラムの主要な計算やロジックの実行とは別に、**望ましい結果以外の影響が生じる可能性がある**処理を指します。特に React では、データのフェッチや DOM の操作、サブスクリプションの設定などが「副作用」に該当します。これらの操作は、コンポーネントがレンダリングされるだけでは完結しない「外部とのやりとり」を伴うためです。

具体的には次のような理由から「副作用」と呼ばれています：

1. **外部の状態に依存する**:

   - データフェッチ（API リクエスト）などは外部のデータに依存しており、そのデータが変更されるとコンポーネントの動作が変わる可能性があります。

2. **アプリケーションの他の部分に影響を与える**:

   - DOM の操作やグローバルなイベントリスナーの追加は、他のコンポーネントやアプリケーションの挙動にも影響を与えることがあります。

3. **タイミングの問題**:

   - コンポーネントがレンダリングされる前後で実行されるため、適切に管理しないと望ましくないタイミングで実行され、バグやパフォーマンス問題の原因になることがあります。

4. **リソース管理の必要性**:
   - サブスクリプションやタイマー、イベントリスナーは、使用後に適切にクリーンアップしないと、メモリリークや意図しない挙動が発生することがあります。

こういった「望む動作以外の影響」を適切に管理するために、`useEffect` のクリーンアップ機能が用意されており、例えばサブスクリプションを解除したり、タイマーをクリアしたりすることができます。

```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    console.log("This is a side effect");
  }, 1000);

  return () => {
    clearTimeout(timer); // クリーンアップ処理
  };
}, []);
```

ここでは、タイマーが設定されることが副作用ですが、コンポーネントがアンマウントされたり依存関係が変わったりする際に、クリーンアップすることで不要な影響を防いでいます。

`useRef` と `useCallback` も自分で実装してみることで、React の仕組みを深く理解できます。これらのフックは、それぞれ異なる目的で使われますが、いずれもコンポーネントのパフォーマンス向上やステート管理の一部として重要です。

### `useRef` の自作実装

`useRef` は、値を保持するための参照オブジェクトを作成し、その値が変更されてもコンポーネントが再レンダリングされないようにするフックです。これをシンプルに模倣すると、以下のような形になります。

```javascript
function useCustomRef(initialValue) {
  const ref = { current: initialValue };

  return ref;
}
```

React の `useRef` と同様に、この `useCustomRef` は、`current` というプロパティを持ったオブジェクトを返し、その値を保持します。値が更新されてもコンポーネントの再レンダリングは行われません。

### `useCallback` の自作実装

`useCallback` は、関数をメモ化して依存関係が変わらない限り同じ関数インスタンスを再利用するために使われます。これにより、不要な再レンダリングや無駄な関数作成を防ぐことができます。

以下のように実装してみましょう。

```javascript
function useCustomCallback(callback, deps) {
  const memoizedCallback = useRef(callback);
  const prevDeps = useRef(deps);

  if (!areDepsEqual(prevDeps.current, deps)) {
    memoizedCallback.current = callback;
    prevDeps.current = deps;
  }

  return memoizedCallback.current;
}

function areDepsEqual(oldDeps, newDeps) {
  return oldDeps.every((dep, i) => dep === newDeps[i]);
}
```

この自作の `useCustomCallback` では、渡された関数と依存関係を参照し、依存関係が変わらない限り同じ関数インスタンスを返すようにしています。依存関係が変わった場合にのみ関数を更新します。

### `useRef` と `useCallback` の違い

- `useRef`: 値や DOM 参照を保持し、値が変更されてもレンダリングに影響を与えない。
- `useCallback`: 関数をメモ化して、依存関係が変わらない限り同じ関数インスタンスを再利用。

これらを自分で実装することで、それぞれの用途や仕組みがより明確に理解できるはずです。
