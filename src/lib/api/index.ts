import { getHealth } from "./health";
import { getWeather, getWeatherStream } from "./weather";
import { postVsix, postVsixStream } from "./vsix";

/** 聚合各模块请求，供页面统一调用 */
export const api = {
  health: getHealth,
  weather: getWeather,
  weatherStream: getWeatherStream,
  vsix: postVsix,
  vsixStream: postVsixStream,
};
