export const APP_PARAMS = {
  appName: "Jornada Congresso 2026",
  appSubtitle: "Preparando o coração para o congresso",
  congressYear: "2026",
};

export function getAppParamValue(paramName, options = {}) {
  return APP_PARAMS[paramName] ?? options.defaultValue ?? null;
}

export function getAppParams() {
  return APP_PARAMS;
}