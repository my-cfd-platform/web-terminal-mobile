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
    console.log(mainAppStore.token)
    mainAppStore.postRefreshToken().finally(() => {
      console.log(mainAppStore.token);
      let searchParams = new URLSearchParams(params);
      searchParams.set("token", mainAppStore.token);
      console.log('redirect');
      const url = `${link}?${searchParams.toString()}`;
      console.log(url)
      // push не открывает ссылку
      push(url)
    });
  }

  return { redirectWithUpdateRefreshToken };
};

export default useRedirectMiddleware;