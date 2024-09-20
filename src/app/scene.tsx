'use client';

import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useEditor, useIsDarkMode, track } from 'tldraw';
import { TlPage } from '../ui/TlPage';
import { CameraControls, PivotControls } from '@react-three/drei';

const BLACK = new THREE.Color(0x000000);
const WHITE = new THREE.Color(0xffffff);

export const Scene = track(() => {
  const editor = useEditor();
  const isDarkMode = useIsDarkMode();
  const { scene } = useThree();
  const cameraRef = useRef<CameraControls>(null);
  const pivotCtrlRef = useRef<THREE.Group>(null);

  useEffect(() => {
    scene.background = isDarkMode ? BLACK : WHITE;
  }, [isDarkMode, scene]);

  const pages = editor.getPages();
  const currentPageId = editor.getCurrentPageId();

  const handlePageDragEnd = () => {
    cameraRef.current!.enabled = true;
    editor.updatePage({
      id: currentPageId,
      meta: { matrix: pivotCtrlRef.current?.matrix.toArray() },
    });
  };

  return (
    <group>
      <CameraControls dollyToCursor infinityDolly ref={cameraRef} />
      {pages.map((page) =>
        page.id === currentPageId ? (
          <PivotControls
            matrix={
              page.meta?.matrix
                ? new THREE.Matrix4().fromArray(page.meta.matrix as number[])
                : undefined
            }
            ref={pivotCtrlRef}
            key={page.id}
            rotation={[0, -Math.PI / 2, 0]}
            depthTest={false}
            lineWidth={2}
            anchor={[0, 0, 0]}
            onDragStart={() => (cameraRef.current!.enabled = false)}
            onDragEnd={handlePageDragEnd}
            disableScaling
          >
            <TlPage id={page.id} isCurrent={true} />
          </PivotControls>
        ) : (
          <TlPage key={page.id} id={page.id} />
        )
      )}
    </group>
  );
});
