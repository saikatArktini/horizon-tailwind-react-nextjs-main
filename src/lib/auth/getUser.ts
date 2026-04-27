import {jwtDecode} from 'jwt-decode';

type TokenPayload = {
  role: string;
  permissions: string[];
};

export function getUserFromToken() {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
}
