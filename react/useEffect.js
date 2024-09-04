function useCustomEffect(callback, deps) {
  // useRefは値を保持するためのフック
  // 初期値をfalseに設定し、依存関係の状態を監視する
  const hasMounted = useRef(false);

  // depsの値を保持する
  const prevDeps = useRef(deps);

  useEffect(() => {
    // 監視している値が変わった場合にコールバック関数を実行する
    if (hasMounted.current) {
      // 依存関係の値が変わった場合にコールバック関数を実行する
      if (!areDepsEqual(prevDeps.current, deps)) {
        callback();

        // depsの値として今回きたものを、次回の比較用に保持する
        prevDeps.current = deps;
      }
    } else {
      // 初回のレンダリング時にコールバック関数を実行する
      callback();
      hasMounted.current = true;
    }
  }, deps);
}

// 依存関係の値が変わったかどうかを判定する
function areDepsEqual(oldDeps, newDeps) {
  return oldDeps.every((oldDep, i) => oldDep === newDeps[i]);
}
