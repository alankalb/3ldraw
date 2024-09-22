import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useEditor, useIsDarkMode, track } from 'tldraw';
import { TlPage } from '../ui/TlPage';
import { CameraControls, PivotControls } from '@react-three/drei';

const BLACK = new THREE.Color(0x101011);
const WHITE = new THREE.Color(0xf9fafb);

export const Scene = track(() => {
  const editor = useEditor();
  const isDarkMode = useIsDarkMode();
  const { scene } = useThree();
  const cameraControlsRef = useRef<CameraControls>(null);

  useEffect(() => {
    scene.background = isDarkMode ? BLACK : WHITE;
  }, [isDarkMode, scene]);

  const pages = editor.getPages();
  const currentPageId = editor.getCurrentPageId();

  return (
    <>
      <CameraControls dollyToCursor infinityDolly ref={cameraControlsRef} />
      {pages.map((page) => (
        <TlPage
          key={page.id}
          id={page.id}
          isCurrent={page.id === currentPageId}
          cameraControls={cameraControlsRef.current}
        />
      ))}
    </>
  );
});
