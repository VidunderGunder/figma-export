import sade from 'sade';
import ora from 'ora';

import { addComponents } from './commands/components.mjs';
import { addStyles } from './commands/styles.mjs';
import { addUseConfig } from './commands/use-config.mjs';

// @ts-ignore
import pkg from '../package.json' assert { type: 'json' }

const prog = sade('figma-export');

const spinner = ora({});

prog.version(pkg.version);

addUseConfig(addStyles(addComponents(prog, spinner), spinner), spinner)
    .parse(process.argv);
