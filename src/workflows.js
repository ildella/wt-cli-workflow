'use strict'
require('dotenv').config()
const logger = require('tracer').colorConsole({level: 'info'})
const { exec, spawn } = require('child_process')
const path = require('path')
const defaultStage = 'dev'

function cronWebtask (filepath, schedule, stage) {
  const options = ['cron', 'create', '--schedule', `${schedule}`, '--tz', 'UTC']
  return _createWebtaskBasic(filepath, stage, options)
}

function createWebtask (filepath, stage) {
  const options = [`create`]
  return _createWebtaskBasic(filepath, stage, options)
}

function _createWebtaskBasic (filepath, stage, options) {
  const filename = path.basename(filepath).replace('.js', '')
  const actualStage = stage || defaultStage
  const taskname = `${filename}-${actualStage}`
  options.push('--secrets-file', '.env', '--name', taskname, filepath)
  const wt = spawn('wt', options)
  wt.stdout.on('data', function (data) {
    console.log(data.toString().replace('\n', ''))
  })
  wt.stderr.on('data', function (data) {
    logger.error(data.toString().replace('\n', ''))
  })
  wt.on('exit', function (code) {
    process.exit(code)
  })
}

const WEBTASK_DOESNT_EXISTS = 'Uncaught error:  unable to read the named webtask'
const WEBTASK_NOT_FOUND = 'Error: Not Found'
const WEBTASK_FILE_MISSING = 'Error resolving the path to the webtask code'
async function runWebtask (input, stage) {
  const filepath = input.includes('.js') ? input : `${input}.js`
  const taskname = input.includes('.js') ? input.replace('.js', '') : input
  const actualStage = stage || defaultStage
  const webtask = `${taskname}-${actualStage}`
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
      logger.error(`Create a basic webtask function file with 'gen webtask:context'`)
    }
    if (data.toString().includes(WEBTASK_NOT_FOUND, WEBTASK_DOESNT_EXISTS)) {
      logger.error('--- wtw error ---')
      logger.error(`A Webtask must be created before it can be run`)
      logger.error(`Create a webtask with 'wtw create {filepath}. eg: 'wtw create index.js'`)
    }
  })
  wt.on('exit', function (code) {
    process.exit(code)
  })
}

async function listWebtasks (input) {
  const baseCommand = 'wt ls'
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

module.exports = { createWebtask, runWebtask, listWebtasks, cronWebtask }
