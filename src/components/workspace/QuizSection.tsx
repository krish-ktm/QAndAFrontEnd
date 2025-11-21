import { useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { QuizSectionDesktop } from './QuizSectionDesktop';
import { QuizSectionMobile } from './QuizSectionMobile';

interface QuizSectionProps {
  productId: string;
}

export const QuizSection = (props: QuizSectionProps) => {
  const isMobile = useIsMobile();
  const [view, setView] = useState<'groups' | 'active'>('groups');

  return isMobile ? (
    <QuizSectionMobile
      {...props}
      view={view}
      onViewChange={setView}
    />
  ) : (
    <QuizSectionDesktop {...props} />
  );
};
