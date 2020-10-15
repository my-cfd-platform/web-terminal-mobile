function throttle(
  func: { apply: (arg0: any, arg1: IArguments | null) => any },
  wait: number,
  options?: { leading?: any; trailing?: any }
) {
  let timeout: NodeJS.Timeout | null,
    context: null,
    args: IArguments | null,
    result: any;
  let previous = 0;
  if (!options) options = {};

  let later = function() {
    previous = options && options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  let throttled: any = function() {
    let now = Date.now();
    if (!previous && options && options.leading === false) previous = now;
    let remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function() {
    if (timeout) clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

export default throttle;
