const chalk = require('chalk')
const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const async = require('async')
const render = require('consolidate').handlebars.render
const path = require('path')
const multimatch = require('multimatch')
const logger = require('./logger')
const filter = require('./filter')
const getOptions = require('./options')

Handlebars.registerHelper('if_eq', function (a,  b, opts) {
    return a === b ? opts.fn(this) : opts.reverse(this)
})

Handlebars.registerHelper('unless_eq', function (a, b, opts) {
    return a === b ? opts.reverse(this) : opts(this)
})

module.exports = function quickGenerate(name, src, dest, done) {
  const opts = getOptions(name, src, true);

  const metalsmith = Metalsmith(path.join(src, 'template'))

  const data = Object.assign(metalsmith.metadata(),
  {
    destDirName: name,
    inPlace: dest === process.cwd(),
    noEscape: true
  })

  metalsmith.use(setDefault(opts.settings))
  .use(filterFiles(opts.filters))
  .use(renderTemplateFiles(opts.skipInterpolation))

  if (typeof opts.metalsmith === 'function') {
    opts.metalsmith(metalsmith, opts, helpers)
  } else if (opts.metalsmith && typeof opts.metalsmith.after === 'function') {
    opts.metalsmith.after(metalsmith, opts, helpers)
  }

  metalsmith.clean(false)
  .source('.')
  .destination(dest)
  .build((err, files) => {
    done(err)
    if (typeof opts.complete === 'function') {
      console.log(111)
      console.log(data)

      const helpers = { chalk, logger, files }
      opts.complete(data, helpers)
    } else {
      logMessage(opts.completeMessage, data)
    }
  })

}


/**
 * Create a middleware for filtering files.
 *
 * @param {Object} filters
 * @return {Function}
 */

function filterFiles (filters) {
  return (files, metalsmith, done) => {
    filter(files, filters, metalsmith.metadata(), done)
  }
}

/**
 * Template in place plugin.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */

function renderTemplateFiles (skipInterpolation) {
  skipInterpolation = typeof skipInterpolation === 'string'
  ? [skipInterpolation]
  : skipInterpolation
  return (files, metalsmith, done) => {
    const keys = Object.keys(files)
    const metalsmithMetadata = metalsmith.metadata()
    async.each(keys, (file, next) => {
      // skipping files with skipInterpolation option
      if (skipInterpolation && multimatch([file], skipInterpolation, { dot: true }).length) {
        return next()
      }
      const str = files[file].contents.toString()
      // do not attempt to render files that do not have mustaches
      if (!/{{([^{}]+)}}/g.test(str)) {
        return next()
      }
      render(str, metalsmithMetadata, (err, res) => {
        if (err) {
          err.message = `[${file}] ${err.message}`
          return next(err)
        }
        files[file].contents = new Buffer(res)
        next()
      })
    }, done)
  }
}


/**
 * Display template complete message.
 *
 * @param {String} message
 * @param {Object} data
 */

function logMessage (message, data) {
  if (!message) return
  render(message, data, (err, res) => {
    if (err) {
      console.error('\n   Error when rendering template complete message: ' + err.message.trim())
    } else {
      console.log('\n' + res.split(/\r?\n/g).map(line => '   ' + line).join('\n'))
    }
  })
}
function setDefault(settings) {
  return (files, metalsmith, done) => {
    const data = metalsmith.metadata();

    Object.keys(settings).forEach(key => {
        console.log(111222)
      data[key] = settings[key].default
      console.log(data)
    })
    done()
  }
}