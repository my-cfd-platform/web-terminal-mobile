import { useStores } from './useStores';
import { push } from "mixpanel-browser";
import { useHistory } from "react-router-dom";

const useRedirectMiddleware = () => {
  const { mainAppStore } = useStores();
  const { push } = useHistory();
  /*
    link:   domain for redirect
    params: url params string include 'token' that will be update
  */
  const redirectWithUpdateRefreshToken = (link: string, params: string) => {
    mainAppStore.postRefreshToken().finally(() => {
      let searchParams = new URLSearchParams(params);
      searchParams.set("token", mainAppStore.token);
      const url = `${window.location.origin}${link}/?${searchParams.toString()}`;
      // push не открывает ссылку
      window.location.href = url;
    });
  }

  return { redirectWithUpdateRefreshToken };
};

export default useRedirectMiddleware;