import { useState } from "react";

export const useFetch = (
  apiFunc: Function
): [string | undefined, Function, boolean | undefined, string | undefined] => {
  const [state, setState] = useState({
    data: undefined,
    error: undefined,
    isLoading: false,
  });

  const fetch = async (params = {}) => {
    let newState = {
      data: undefined,
      error: undefined,
      isLoading: false,
    };

    setState({ ...state, isLoading: true });
    try {
      const res = await apiFunc(params);
      const data = res.data?.data || res.data || res;
      newState = { ...state, data };
    } catch (error: any) {
      console.error(error);
      newState = { ...state, error };
    } finally {
      newState.isLoading = false;
    }
    setState(newState);

    return newState;
  };

  return [state.data, fetch, state.isLoading, state.error];
};
