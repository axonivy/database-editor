import type { DatabaseConfigurationData } from '@axonivy/database-editor-protocol';
import { getUrl } from './DatabaseMasterContent';

test('getUrl', () => {
  const complProps = { 'ch.ivyteam.jdbc.Host': 'localhost', 'ch.ivyteam.jdbc.Port': '3306' };
  const missingHostProps = { 'ch.ivyteam.jdbc.Port': '3306' };
  const missingPortProps = { 'ch.ivyteam.jdbc.Host': 'localhost' };
  const data: DatabaseConfigurationData = {
    name: 'db1',
    driver: '',
    icon: '',
    maxConnections: 0,
    properties: complProps,
    additionalProperties: {}
  };

  expect(getUrl(data)).toEqual('localhost:3306');

  data.properties = missingHostProps;
  expect(getUrl(data)).toEqual('');

  data.properties = missingPortProps;
  expect(getUrl(data)).toEqual('localhost');
});
