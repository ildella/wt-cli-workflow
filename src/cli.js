#!/usr/bin/env node
const program = require('commander')
const wt = require('./workflows')

program
  .version('0.0.1')
  .description('Webtask Workflow CLI')

program
  .command('create <filepath> [stage]')
  .description('create a new webtask (will override an exiting one that has the same name)')
  .action((filepath, stage) => wt.createWebtask(filepath, stage))

program
  .command('run <taskname> [stage]')
  .description('run a webtask')
  .action((taskname, stage) => wt.runWebtask(taskname, stage))

program
  .command('ls <search>')
  .description('list all webtaskthat contain the search text')
  .action(taskname => wt.listWebtasks(taskname))

program.parse(process.argv)
