const ADMIN_KEY_ENV_CANDIDATES = [
  'DEVUSER_ADMIN_KEY',
  'ADMIN_PANEL_KEY',
  'DIK_ADMIN_KEY',
  'BOOKMARKS_ADMIN_KEY',
];

const FALLBACK_ADMIN_CREDENTIALS = [
  {
    email: 'ozbakirsahincande@gmail.com',
    password: '.almanya101seninle!',
  },
  {
    email: 'ubterzioglu@gmail.com',
    password: 'PPPlll!1111',
  },
];

export function getExpectedAdminKey() {
  for (const envName of ADMIN_KEY_ENV_CANDIDATES) {
    const value = process.env[envName];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
}

function parseCredentialList(rawValue) {
  if (typeof rawValue !== 'string' || !rawValue.trim()) return [];

  const value = rawValue.trim();

  if (value.startsWith('[')) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => ({
            email: String(item?.email || '').trim().toLowerCase(),
            password: String(item?.password || '').trim(),
          }))
          .filter((item) => item.email && item.password);
      }
    } catch {
      return [];
    }
  }

  return value
    .split(/[;\n]/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(':');
      if (separatorIndex < 1) return null;

      const email = line.slice(0, separatorIndex).trim().toLowerCase();
      const password = line.slice(separatorIndex + 1).trim();
      if (!email || !password) return null;

      return { email, password };
    })
    .filter(Boolean);
}

function getExpectedAdminCredentials() {
  const fromEnv = parseCredentialList(process.env.DEVUSER_ADMIN_CREDENTIALS);
  if (fromEnv.length > 0) return fromEnv;
  return FALLBACK_ADMIN_CREDENTIALS;
}

export function getProvidedAdminKey(req) {
  const headerKey = req.headers['x-admin-key'];
  const authHeader = req.headers.authorization || '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const queryKey = typeof req.query?.key === 'string' ? req.query.key.trim() : '';

  return (headerKey || bearer || queryKey || '').toString().trim();
}

export function getProvidedAdminCredentials(req) {
  const headerEmail = req.headers['x-admin-email'];
  const queryEmail = typeof req.query?.admin_email === 'string' ? req.query.admin_email.trim() : '';
  const email = (headerEmail || queryEmail || '').toString().trim().toLowerCase();

  const headerPassword = req.headers['x-admin-password'];
  const queryPassword = typeof req.query?.admin_password === 'string' ? req.query.admin_password.trim() : '';
  const password = (headerPassword || queryPassword || '').toString().trim();

  return { email, password };
}

export function isAdminAuthorized(req) {
  const expectedKey = getExpectedAdminKey();
  const providedKey = getProvidedAdminKey(req);
  if (expectedKey && providedKey && providedKey === expectedKey) {
    return { ok: true, reason: '', status: 200 };
  }

  const expectedCredentials = getExpectedAdminCredentials();
  const providedCredentials = getProvidedAdminCredentials(req);
  const credentialMatch = expectedCredentials.some((item) => {
    return item.email === providedCredentials.email && item.password === providedCredentials.password;
  });

  if (credentialMatch) {
    return { ok: true, reason: '', status: 200 };
  }

  if (!expectedKey && expectedCredentials.length === 0) {
    return { ok: false, reason: 'Admin key not configured', status: 500 };
  }

  return { ok: false, reason: 'Unauthorized', status: 401 };
}

export function parseJsonBody(req) {
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    return req.body;
  }
  return null;
}
