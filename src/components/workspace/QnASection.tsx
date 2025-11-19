import { useIsMobile } from '../../hooks/useIsMobile';
import { QnASectionDesktop } from './QnASectionDesktop';
import { QnASectionMobile } from './QnASectionMobile';

interface QnASectionProps {
  productId: string;
}

export const QnASection = (props: QnASectionProps) => {
  const isMobile = useIsMobile();

  return isMobile ? <QnASectionMobile {...props} /> : <QnASectionDesktop {...props} />;
};
