import chalk from 'chalk';
import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

const localIPv4 = WebpackDevServer.internalIPSync('v4');

class TerminalPrintPlugin {
  constructor() {}

  apply(compiler: Compiler) {
    compiler.hooks.done.tapAsync('TerminalPrintPlugin', (stats, callback) => {
      const publicPath = stats.compilation.outputOptions.publicPath as string;
      const port = stats.compilation.options.devServer!.port as number;
      console.log('  App running at:');
      console.log(
        `- Local:   ${chalk.cyan(`http://localhost:${port}${publicPath}`)}`
      );
      console.log(
        `- Network: ${chalk.cyan(`http://${localIPv4!}:${port}${publicPath}`)}`
      );
      console.log();
      callback();
    });
  }
}

export default TerminalPrintPlugin;
