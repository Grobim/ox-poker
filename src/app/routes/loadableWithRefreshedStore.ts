import { createElement } from "react";

import loadable, { DefaultComponent, Options } from "@loadable/component";

import { withRefreshedStore } from "../redux/StoreManager";

import Loader from "../Loader";

const loadableWithRefreshedStore = <T>(
  loader: (props: T) => Promise<DefaultComponent<T>>,
  options?: Options<T>
) =>
  loadable((props) => withRefreshedStore(loader(props)), {
    fallback: createElement(Loader, { fill: true }),
    ...options,
  });

export { loadableWithRefreshedStore };
