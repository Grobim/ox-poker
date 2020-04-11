import appSlice from "./slice";

const { name: appName, reducer: appReducer } = appSlice;

const reducers = {
  [appName]: appReducer,
};

export { reducers };
