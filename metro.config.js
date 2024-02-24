const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// 포트 번호를 원하는 값으로 변경합니다.
config.server.port = 3030;

module.exports = config;
