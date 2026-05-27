import type { FC } from 'react';
import type { PiSkeletonForgeProps, PiSkeletonNode } from '../types/lumina';

const renderNode = (node: PiSkeletonNode): JSX.Element => (
  <div
    key={node.key}
    style={{
      width: node.width,
      height: node.height,
      borderRadius: node.borderRadius ?? 10,
      background: 'linear-gradient(90deg, rgba(255,255,255,0.07) 25%, rgba(255,255,255,0.15) 37%, rgba(255,255,255,0.07) 63%)',
      backgroundSize: '400% 100%',
      animation: 'pi-lumina-skeleton 1.2s ease-in-out infinite',
      marginBottom: 8
    }}
  >
    {node.children?.map((child) => renderNode(child))}
  </div>
);

/**
 * Generates schema-driven skeleton placeholders to avoid layout shifts on slow networks.
 */
export const PiSkeletonForge: FC<PiSkeletonForgeProps> = ({
  loading,
  schema,
  children,
  className,
  style
}) => {
  if (!loading) {
    return <>{children}</>;
  }

  return (
    <div className={className} style={style} aria-busy="true" aria-live="polite">
      <style>
        {`@keyframes pi-lumina-skeleton { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }`}
      </style>
      {schema.map((node) => renderNode(node))}
    </div>
  );
};
