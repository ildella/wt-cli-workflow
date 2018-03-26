'use strict'
require('dotenv').config()
const logger = require('tracer').colorConsole({level: 'info'})
const { exec, spawn } = require('child_process')
const path = require('path')
// const _ = require('lodash')

async function createWebtask (filepath, stage) {
  const filename = path.basename(filepath).replace('.js', '')
  const actualStage = stage || 'test'
  const taskname = `${filename}-${actualStage}`
  const wt = spawn('wt', [`create`, '--secrets-file', '.env', '--name', `${taskname}`, `${filepath}`])
  wt.stdout.on('data', function (data) {
    console.log('stdout: ' + data.toString())
  })
  wt.stderr.on('data', function (data) {
    console.log('stderr: ' + data.toString())
  })
  wt.on('exit', function (code) {
    // console.log('child process exited with code ' + code.toString())
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
  logger.info(`update and monitor --> ${webtask} from source ${filepath}`)
  const wt = spawn('wt', [`update`, `${webtask}`, `${filepath}`, '-w'])
  wt.stdout.on('data', function (data) {
    console.log(data.toString().replace('\n'))
  })
  wt.stderr.on('data', function (data) {
    if (data.toString().includes(WEBTASK_DOESNT_EXISTS, WEBTASK_FILE_NOT_FOUND) > -1) {
      logger.error(`Webtask ${webtask} has not been created. Please use 'create' command`)
    }
    if (data.toString().includes(WEBTASK_FILE_NOT_FOUND) > -1) {
    }
    // TODO: write addidional error to file
  })
  wt.on('exit', function (code) {
    process.exit(code)
  })
}

// async function run (environment) {
//   return testWebtask()
// }

module.exports = { createWebtask, runWebtask }
