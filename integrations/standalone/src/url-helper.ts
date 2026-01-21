export function parameter(key: string): string | undefined {
  const param = new URLSearchParams(window.location.search).get(key);
  return param !== null ? decodeURIComponent(param) : undefined;
}

export function appParam(): string {
  return parameter('app') ?? '';
}

export function pmvParam(): string {
  return parameter('pmv') ?? '';
}

export function themeParam(): 'dark' | 'light' {
  const theme = parameter('theme');
  if (theme === 'dark') {
    return theme;
  }
  return 'light';
}

export function readonlyParam(): boolean {
  return parameter('readonly') === 'true';
}

export function directSaveParam(): boolean {
  return parameter('directSave') !== undefined;
}

export function webSocketBaseParam(): string {
  return `${isSecureConnection() ? 'wss' : 'ws'}://${server()}`;
}

export function metaJdbcDriversStateParam(): string {
  return parameter('metaJdbcDriversState') ?? '';
}

const isSecureConnection = () => {
  const secureParam = parameter('secure');
  if (secureParam === 'true') {
    return true;
  }
  if (secureParam === 'false') {
    return false;
  }
  return window.location.protocol === 'https:';
};

const server = () => {
  return parameter('server') ?? basePath();
};

const basePath = () => {
  return 'localhost:8081';
};
