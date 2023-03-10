#!/usr/bin/env node

import createApp from '../lib';

if (require.main === module) {
  createApp(process.argv.slice(2));
}
