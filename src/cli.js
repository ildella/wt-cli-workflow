#!/usr/bin/env node
const program = require('commander')
const wt = require('./workflows')
const pjson = require('../package.json')

program
  .version(pjson.version, '-v, --version')
  .description(pjson.description)

program
  .command('create <filepath> [env]')
  .description('create a new webtask (will override an exiting one that has the same name)')
  .action((filepath, env) => wt.createWebtask(filepath, env))

program
  .command('cron <filepath> <schedule> [env]')
  .description('create a webtask that run with the specified schedule using cron')
  .action((filepath, schedule, env) => wt.cronWebtask(filepath, schedule, env))

program
  .command('run <taskname> [env]')
  .description('run a webtask and monitor for local changes')
  .action((taskname, env) => wt.runWebtask(taskname, env))

program
  .command('ls [search]')
  .description('list all webtask that contain the search text (using grep, nothing more)')
  .action(taskname => wt.listWebtasks(taskname))

program
  .command('rm [tasks...]')
  .description('remove all the specified webtasks')
  .action(tasks => wt.rmWebtasks(tasks))

program.parse(process.argv)
