import * as migration_20261101_201137_initial from './20261101_201137_initial';

export const migrations = [
  {
    up: migration_20261101_201137_initial.up,
    down: migration_20261101_201137_initial.down,
    name: '20261101_201137_initial'
  },
];
