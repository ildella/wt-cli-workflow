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
    console.log(data.toString().replace('\n'))
  })
  wt.stderr.on('data', function (data) {
    logger.error(data.toString().replace('\n'))
  })
  wt.on('exit', function (code) {
    process.exit(code)
  })
}

const WEBTASK_DOESNT_EXISTS = 'Uncaught error:  unable to read the named webtask'
const WEBTASK_FILE_NOT_FOUND = 'Error: Not Found'
async function runWebtask (input, stage) {
  const filepath = input.includes('.js') ? input : `${input}.js`
  const taskname = input.includes('.js') ? input.replace('.js', '') : input
  const actualStage = stage || 'test'
  const webtask = `${taskname}-${actualStage}`
  logger.info(`run with live redeploy --> ${webtask} from source ${filepath}`)
  const wt = spawn('wt', [`update`, `${webtask}`, `${filepath}`, '-w'])
  wt.stdout.on('data', function (data) {
    console.log(data.toString().replace('\n'))
  })
  wt.stderr.on('data', function (data) {
    if (data.toString().includes(WEBTASK_DOESNT_EXISTS, WEBTASK_FILE_NOT_FOUND) > -1) {
      logger.error(`A Webtask named '${webtask}' does not exists. Please use 'create' command to create one`)
    } else {
      logger.error(data.toString().replace('\n'))
    }
  })
  wt.on('exit', function (code) {
    process.exit(code)
  })
}

module.exports = { createWebtask, runWebtask }
