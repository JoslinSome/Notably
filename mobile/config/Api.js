import Constants from "expo-constants";

const { expoConfig } = Constants;
const api = (typeof expoConfig.packagerOpts === `object`) && expoConfig.packagerOpts.dev
    ? expoConfig.debuggerHost.split(`:`).shift().concat(`:3002`)
    : `api.example.com`;
export {api}
