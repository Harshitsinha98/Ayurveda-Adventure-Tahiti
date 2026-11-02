import * as migration_20261101_201137_initial from './20261101_201137_initial';
import * as migration_20261102_034505_localization from './20261102_034505_localization';
import * as migration_20261102_174310_offering_sections from './20261102_174310_offering_sections';
import * as migration_20261102_210645_customers_auth from './20261102_210645_customers_auth';

export const migrations = [
  {
    up: migration_20261101_201137_initial.up,
    down: migration_20261101_201137_initial.down,
    name: '20261101_201137_initial',
  },
  {
    up: migration_20261102_034505_localization.up,
    down: migration_20261102_034505_localization.down,
    name: '20261102_034505_localization',
  },
  {
    up: migration_20261102_174310_offering_sections.up,
    down: migration_20261102_174310_offering_sections.down,
    name: '20261102_174310_offering_sections',
  },
  {
    up: migration_20261102_210645_customers_auth.up,
    down: migration_20261102_210645_customers_auth.down,
    name: '20261102_210645_customers_auth'
  },
];
