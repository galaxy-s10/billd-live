import BilldDeploy from 'billd-deploy/package.json';
import BilldHtmlWebpackPlugin from 'billd-html-webpack-plugin/package.json';
import BilldScss from 'billd-scss/package.json';
import BilldUtils from 'billd-utils/package.json';

console.table({
  'billd-utils version': BilldUtils.version,
  'billd-scss version': BilldScss.version,
  'billd-deploy version': BilldDeploy.version,
  'billd-html-webpack-plugin version': BilldHtmlWebpackPlugin.version,
});
