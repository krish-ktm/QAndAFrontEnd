import { useIsMobile } from '../../hooks/useIsMobile';
import { FlashcardSectionDesktop } from './FlashcardSectionDesktop';
import { FlashcardSectionMobile } from './FlashcardSectionMobile';

interface FlashcardSectionProps {
  productId: string;
}

export const FlashcardSection = (props: FlashcardSectionProps) => {
  const isMobile = useIsMobile();

  return isMobile ? <FlashcardSectionMobile {...props} /> : <FlashcardSectionDesktop {...props} />;
};
