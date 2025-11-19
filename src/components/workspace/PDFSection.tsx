import { useIsMobile } from '../../hooks/useIsMobile';
import { PDFSectionDesktop } from './PDFSectionDesktop';
import { PDFSectionMobile } from './PDFSectionMobile';

interface PDFSectionProps {
  productId: string;
}

export const PDFSection = (props: PDFSectionProps) => {
  const isMobile = useIsMobile();

  return isMobile ? <PDFSectionMobile {...props} /> : <PDFSectionDesktop {...props} />;
};
