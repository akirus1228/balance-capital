const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const nrwlConfig = require("@nrwl/react/plugins/webpack.js");

module.exports = (config, context) => {
  config = {
    ...config,
    node: {
      fs: "empty",
      net: "empty",
      tls: "empty",
    },
    target: "node",
    plugins: [...config.plugins, new NodePolyfillPlugin()],
  };
  return nrwlConfig(config);
};
