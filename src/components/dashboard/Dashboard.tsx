import { useIsMobile } from '../../hooks/useIsMobile';
import { DashboardDesktop } from './DashboardDesktop';
import { DashboardMobile } from './DashboardMobile';

interface DashboardProps {
  onSelectProduct: (productId: string) => void;
}

export const Dashboard = (props: DashboardProps) => {
  const isMobile = useIsMobile();

  return isMobile ? <DashboardMobile {...props} /> : <DashboardDesktop {...props} />;
};
