import { useStores } from './useStores';
import { push } from "mixpanel-browser";
import { useHistory } from 'react-router-dom';
import { DebugTypes } from '../types/DebugTypes';
import debugLevel from '../constants/debugConstants';
import { getProcessId } from '../helpers/getProcessId';
import { getCircularReplacer } from '../helpers/getCircularReplacer';
import API from '../helpers/API';
import { getStatesSnapshot } from '../helpers/getStatesSnapshot';

const useRedirectMiddleware = () => {
  const { mainAppStore } = useStores();
  const { push } = useHistory();
  /*
    link:   domain for redirect
    params: url params string include 'token' that will be update
  */
  const redirectWithUpdateRefreshToken = (link: string, params: string) => {
    const unparsedParams = JSON.parse('{"' + decodeURI(
      params.replace(/&/g, "\",\"")
        .replace(/=/g,"\":\"")
    ) + '"}');
    const arrayOfParams = Object.values(unparsedParams);
    if (arrayOfParams.some((item) => !item)) {
      const jsonLogObject = {
        error: 'redirect error',
        arrayOfParams: arrayOfParams,
        snapShot: JSON.stringify(getStatesSnapshot(mainAppStore), getCircularReplacer()),
      };
      const params: DebugTypes = {
        level: debugLevel.DATAFLOW,
        processId: getProcessId(),
        message: 'something empty in object',
        jsonLogObject: JSON.stringify(jsonLogObject)
      };
      API.postDebug(params, API_STRING);
    }
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