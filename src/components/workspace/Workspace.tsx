import { useIsMobile } from '../../hooks/useIsMobile';
import { WorkspaceDesktop } from './WorkspaceDesktop';
import { WorkspaceMobile } from './WorkspaceMobile';

interface WorkspaceProps {
  productId: string;
  onBack: () => void;
}

export const Workspace = (props: WorkspaceProps) => {
  const isMobile = useIsMobile();

  return isMobile ? <WorkspaceMobile {...props} /> : <WorkspaceDesktop {...props} />;
};
