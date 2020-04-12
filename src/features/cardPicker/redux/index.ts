import slice from "./slice";

if (process.env.NODE_ENV !== "production") {
  if (module.hot) {
    module.hot.accept("./slice");
  }
}

export const { setSelectedCard, setCards } = slice.actions;
