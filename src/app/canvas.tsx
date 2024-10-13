import * as THREE from 'three';
import { Canvas as ThreeCanvas, events } from '@react-three/fiber';
import { Scene } from './scene';
import { useDocumentEvents } from '@/hooks/useDocumentEvents';

export function Canvas() {
  useDocumentEvents();
  return (
    <div className='tl-canvas' draggable={false}>
      <ThreeCanvas
        camera={{ far: 100000, position: new THREE.Vector3(0, 0, 1000) }}
      >
        <Scene />
      </ThreeCanvas>
    </div>
  );
}
