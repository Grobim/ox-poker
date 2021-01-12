import {
  Action,
  AnyAction,
  combineReducers,
  configureStore,
  ConfigureStoreOptions,
  Middleware,
  Reducer,
  ReducersMapObject,
  Store,
  compose,
  CombinedState,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import persistState, { mergePersistedState } from "redux-localstorage";
import adapter from "redux-localstorage/lib/adapters/localStorage";
import filter from "redux-localstorage-filter";
import { getFirebase } from "react-redux-firebase";

const reduceReducers = <S, A extends Action>(reducers: Reducer<S, A>[]) => (
  state: S,
  action: A
) => reducers.reduce((result, reducer) => reducer(result, action), state);

type Middlewares<S = any> = ReadonlyArray<Middleware<{}, S>>;

interface StoreManagerOptions<
  S = any,
  A extends Action = AnyAction,
  M extends Middlewares<S> = Middlewares<S>
> extends Omit<ConfigureStoreOptions<S, A, M>, "reducer"> {
  reducer?: Record<string, Reducer<S, A>>;
}

class StoreManager<
  S = any,
  A extends AnyAction = AnyAction,
  M extends Middlewares<S> = Middlewares<S>
> {
  public readonly store: Store<S | CombinedState<S>, A>;
  private readonly reducerMap: Record<string, Reducer<S, A>[]> = {};

  constructor(options: StoreManagerOptions<S, A, M>) {
    this.store = configureStore<S, A, M>({
      ...options,
      reducer: this.createRootReducer(),
    });

    if (options.reducer) {
      this.registerReducers(options.reducer);
      this.refreshStore();
    }
  }

  public registerReducers(reducerMap: Record<string, Reducer<S, A>>) {
    Object.entries(reducerMap).forEach(([name, reducer]) => {
      if (!this.reducerMap[name]) this.reducerMap[name] = [];

      this.reducerMap[name] = [reducer];
    });
  }

  public refreshStore() {
    this.store.replaceReducer(this.createRootReducer());
  }

  private createRootReducer() {
    let rootReducer;
    const reducerKeys = Object.keys(this.reducerMap);

    if (reducerKeys.length) {
      const reducedReducers = reducerKeys.reduce(
        (result, key) =>
          Object.assign(result, {
            [key]: reduceReducers(this.reducerMap[key]),
          }),
        {} as ReducersMapObject<S, AnyAction>
      );

      rootReducer = combineReducers(reducedReducers);
    } else {
      rootReducer = (state?: S | undefined) => state as S;
    }

    return compose(mergePersistedState())(rootReducer) as typeof rootReducer;
  }
}

const withRefreshedStore = async <T>(
  importPromise: Promise<T>,
  manager: StoreManager = defaultStoreManager
): Promise<T> => {
  const module = await importPromise;

  manager.refreshStore();

  return module;
};

const storage = compose(
  filter(["firestore.data.settings", "app.lastConnectedUId"])
)(adapter(window.localStorage));

const defaultStoreManager = new StoreManager({
  middleware: getDefaultMiddleware({
    thunk: { extraArgument: { getFirebase } },
    serializableCheck: false,
  }),
  devTools: process.env.NODE_ENV !== "production",
  enhancers: [persistState(storage, "OX-POKER/settings") as any],
});

export { withRefreshedStore, StoreManager };
export default defaultStoreManager;
