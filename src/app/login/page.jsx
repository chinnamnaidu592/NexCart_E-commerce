import LoginPageClient from './LoginPageClient';

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const roleParam =
    params.role === undefined ? null : typeof params.role === 'string' ? params.role : '';
  const redirectPath = Array.isArray(params.redirect)
    ? params.redirect[0] || '/'
    : params.redirect || '/';

  return <LoginPageClient roleParam={roleParam} redirectPath={redirectPath} />;
}
