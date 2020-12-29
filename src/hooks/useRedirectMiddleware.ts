import { useStores } from './useStores';
import { push } from "mixpanel-browser";
import { useHistory } from "react-router-dom";

const useRedirectMiddleware = () => {
  const { push } = useHistory();
  const { mainAppStore } = useStores();
  
  const redirectWithUpdateRefreshToken = (link: string, params: string) => {

    console.log(mainAppStore.token)

    mainAppStore.postRefreshToken().finally(() => {
      console.log(mainAppStore.token);

      let searchParams = new URLSearchParams(params);
      searchParams.set("token", mainAppStore.token);
      console.log('redirect');
      const url = `${link}?${searchParams.toString()}`;
      // push не открывает ссылку
      window.location.href = url;
    });
  }

  return {redirectWithUpdateRefreshToken}
};

export default useRedirectMiddleware;