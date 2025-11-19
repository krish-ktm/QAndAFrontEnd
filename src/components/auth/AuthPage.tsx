import { useIsMobile } from '../../hooks/useIsMobile';
import { AuthPageDesktop } from './AuthPageDesktop';
import { AuthPageMobile } from './AuthPageMobile';

export const AuthPage = () => {
  const isMobile = useIsMobile();

  return isMobile ? <AuthPageMobile /> : <AuthPageDesktop />;
};
