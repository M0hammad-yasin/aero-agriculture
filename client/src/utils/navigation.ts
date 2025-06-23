import { NavigateFunction } from 'react-router-dom';

let navigate: NavigateFunction | null = null;

export const setNavigate = (nav: NavigateFunction) => {
  navigate = nav;
};

export const getNavigate = () => {
  if (!navigate) {
    console.warn('Navigation function not set. Make sure to call setNavigate with a valid navigation function.');
  }
  return navigate;
};

export const navigateToLogin = () => {
  const nav = getNavigate();
  if (nav) {
    nav('/login', { replace: true });
  }
}; 