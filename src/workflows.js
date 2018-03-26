'use strict'
require('dotenv').config()
const logger = require('tracer').colorConsole({level: 'info'})
const { spawn } = require('child_process')
const path = require('path')

async function createWebtask (filepath, stage) {
  const filename = path.basename(filepath).replace('.js', '')
  const actualStage = stage || 'test'
  const taskname = `${filename}-${actualStage}`
  const wt = spawn('wt', [`create`, '--secrets-file', '.env', '--name', `${taskname}`, `${filepath}`])
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
  const actualStage = stage || 'test'
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

module.exports = { createWebtask, runWebtask }
