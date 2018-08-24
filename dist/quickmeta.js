const path = require('path')
const fs = require('fs')

const {
  sortDependencies,
  installDependencies,
  runLintFix,
  printMessage
} = require('../lib/utils')

const { addTestAnswers } = require('./scenarios')

const pkg = require('../package.json')

const tplVersion = pkg.version

module.exports = {
  metalsmith: {
    before: addTestAnswers
  },
  helpers: {
    if_or(v1, v2, options) {

      if (v1 || v2) {
        return options.fn(this)
      }

      return options.inverse(this)
    },
    template_version() {
      return tplVersion
    },
  },
  settings: {
    name:{
      default: 'Woex'
    },
    description:{
      default: 'A quick built project'
    },
    author: {
      default: 'Author'
    },
    lint:{
      default: true
    },
    router: {
      default: 'true'
    },
    autoInstall: {
       default: 'npm'
    }
  },
  filters: {
    'config/test.env.js': 'unit || e2e',
    'build/webpack.test.conf.js': "unit && runner === 'karma'",
    'test/unit/**/*': 'unit',
    'test/unit/index.js': "unit && runner === 'karma'",
    'test/unit/jest.conf.js': "unit && runner === 'jest'",
    'test/unit/karma.conf.js': "unit && runner === 'karma'",
    'test/unit/specs/index.js': "unit && runner === 'karma'",
    'test/unit/setup.js': "unit && runner === 'jest'",
    'test/e2e/**/*': 'e2e',
    'src/router/**/*': 'router',
  },
  complete: function (data, {chalk}) {
    const green = chalk.green

    sortDependencies(data, green)

    //自动执行安装
    if (data.autoInstall) {
      //node执行目录
      const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName)

      installDependencies(cwd, data.autoInstall, green)
      .then(() => {
        return runLintFix(cwd, data, green)
      }).then(() => {
        printMessage(data, green)
      })
      .catch(e => {
        console.log(chalk.red('Error:'), e)
      })
    }else {
      printMessage(data, chalk)
    }

  }
}

