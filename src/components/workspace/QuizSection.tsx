import { useIsMobile } from '../../hooks/useIsMobile';
import { QuizSectionDesktop } from './QuizSectionDesktop';
import { QuizSectionMobile } from './QuizSectionMobile';

interface QuizSectionProps {
  productId: string;
}

export const QuizSection = (props: QuizSectionProps) => {
  const isMobile = useIsMobile();

  return isMobile ? <QuizSectionMobile {...props} /> : <QuizSectionDesktop {...props} />;
};
