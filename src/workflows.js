'use strict'
// require('dotenv').config()
const logger = require('tracer').colorConsole({level: 'info'})
const { exec, spawn } = require('child_process')
const path = require('path')
const defaultEnv = 'dev'
// const bin = './node_modules/wt-cli/bin/wt'
const bin = 'wt'

const WEBTASK_FILE_MISSING = 'Error resolving the path to the webtask code'
const WEBTASK_DOESNT_EXISTS = 'Uncaught error:  unable to read the named webtask'
const WEBTASK_NOT_FOUND = 'Error: Not Found'

function cronWebtask (filepath, schedule, env) {
  const options = ['cron', 'create', '--schedule', `${schedule}`, '--tz', 'UTC']
  return _createWebtaskBasic(filepath, env, options)
}

function createWebtask (filepath, env) {
  const options = [`create`]
  return _createWebtaskBasic(filepath, env, options)
}

function _createWebtaskBasic (filepath, env, options) {
  const filename = path.basename(filepath).replace('.js', '')
  const actualEnv = env || defaultEnv
  const taskname = `${filename}-${actualEnv}`
  options.push('--secrets-file', `.env.${actualEnv}`, '--name', taskname, filepath)
  const wt = spawn('wt', options)
  wt.stdout.on('data', function (data) {
    console.log(data.toString().replace('\n', ''))
  })
  wt.stderr.on('data', function (data) {
    logger.error('--- original webtask error ---')
    logger.error(data.toString().replace('\n', ''))
    if (data.toString().includes(WEBTASK_FILE_MISSING)) {
      logger.error('--- wtw error ---')
      logger.error(`A source file named '${filepath}' must exists`)
    }
  })
  wt.on('exit', function (code) {
    console.log('exit', code)
    process.exit(code)
  })
}

async function runWebtask (input, env) {
  const filepath = input.includes('.js') ? input : `${input}.js`
  const taskname = path.basename(filepath).replace('.js', '')
  const actualEnv = env || defaultEnv
  const webtask = `${taskname}-${actualEnv}`
  logger.info(`run with live redeploy --> ${webtask} from source ${filepath}`)
  const wt = spawn('wt', [`update`, `${webtask}`, `${filepath}`, '-w'])
  wt.stdout.on('data', function (data) {
    console.log(data.toString().replace('\n', ''))
  })
  wt.stderr.on('data', function (data) {
    logger.error('--- original webtask error ---')
    logger.error(data.toString().replace('\n', ''))
    if (data.toString().includes(WEBTASK_FILE_MISSING)) {
      logger.error('--- wtw error ---')
      logger.error(`A source file named '${filepath}' must exists`)
    }
    if (data.toString().includes(WEBTASK_NOT_FOUND, WEBTASK_DOESNT_EXISTS)) {
      logger.error('--- wtw error ---')
      logger.error(`A Webtask named '${webtask}' does not exists. It must be created before it can be run`)
      logger.error(`Create a webtask with 'wtw create {filepath}. eg: 'wtw create index.js'`)
    }
  })
  wt.on('exit', function (code) {
    process.exit(code)
  })
}

async function listWebtasks (input) {
  const baseCommand = `${bin} ls`
  const command = input ? `${baseCommand} |grep ${input}` : baseCommand
  exec(command, (err, stdout, stderr) => {
    if (err) {
      logger.error(err)
      return
    }
    console.log(`${stdout}`)
    console.log(`${stderr}`)
  })
}

async function rmWebtasks (webtasks) {
  webtasks.forEach(function (task) {
    exec(`${bin} rm ${task}`, (err, stdout, stderr) => {
      if (err) {
        logger.error(err)
        return
      }
      console.log(`${stdout}`)
      console.log(`${stderr}`)
    })
  })
}

module.exports = { createWebtask, cronWebtask, runWebtask, listWebtasks, rmWebtasks }
