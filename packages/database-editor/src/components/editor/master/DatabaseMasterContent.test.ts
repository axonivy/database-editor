import type { DatabaseConfigurationData } from '@axonivy/database-editor-protocol';
import { driverOfConnection, urlOfConnection } from './DatabaseMasterContent';

test('urlOfConnection', () => {
  const data = {} as DatabaseConfigurationData;

  data.properties = {
    'ch.ivyteam.jdbc.Host': 'localhost',
    'ch.ivyteam.jdbc.Port': '3306',
    'ch.ivyteam.ivy.connectionUrl': 'connection:url'
  };
  expect(urlOfConnection(data)).toEqual('localhost:3306');

  data.properties = { 'ch.ivyteam.jdbc.Host': 'localhost', 'ch.ivyteam.ivy.connectionUrl': 'connection:url' };
  expect(urlOfConnection(data)).toEqual('localhost');

  data.properties = { 'ch.ivyteam.jdbc.ConnectionUrl': 'connection:url' };
  expect(urlOfConnection(data)).toEqual('connection:url');

  data.properties = {};
  expect(urlOfConnection(data)).toBeUndefined();
});

test('driverOfConnection', () => {
  const data = {} as DatabaseConfigurationData;

  data.properties = { 'ch.ivyteam.jdbc.DriverName': 'DriverFromProperties' };
  expect(driverOfConnection(data)).toEqual('DriverFromProperties');

  data.driver = '';
  expect(driverOfConnection(data)).toEqual('DriverFromProperties');

  data.driver = 'DriverFromField';
  expect(driverOfConnection(data)).toEqual('DriverFromField');
});
