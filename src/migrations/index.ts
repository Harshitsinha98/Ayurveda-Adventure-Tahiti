import * as migration_20261101_201137_initial from './20261101_201137_initial';
import * as migration_20261102_034505_localization from './20261102_034505_localization';

export const migrations = [
  {
    up: migration_20261101_201137_initial.up,
    down: migration_20261101_201137_initial.down,
    name: '20261101_201137_initial',
  },
  {
    up: migration_20261102_034505_localization.up,
    down: migration_20261102_034505_localization.down,
    name: '20261102_034505_localization'
  },
];
