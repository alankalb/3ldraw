'use client';

import { useEditor, track, TLPageId } from 'tldraw';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';

interface TlPageProps {
  id: TLPageId;
  isCurrent?: boolean;
}

export const TlPage = track(({ id, isCurrent }: TlPageProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const editor = useEditor();
  const page = editor.getPage(id);

  useEffect(() => {
    if (!groupRef.current || !pageMatrix || isCurrent) return;
    groupRef.current.matrix = new THREE.Matrix4().fromArray(pageMatrix);
  }, [isCurrent]);

  const handleClick = () => {
    editor.setCurrentPage(id);
  };

  if (!page) return;

  const pageMatrix = page.meta.matrix as undefined | number[];

  return (
    <group
      ref={groupRef}
      name={page.id}
      matrixAutoUpdate={false}
      onClick={handleClick}
    >
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
});
