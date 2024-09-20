'use client';

import { Canvas as ThreeCanvas } from '@react-three/fiber';
import { Scene } from './scene';

export function Canvas() {
  return (
    <div className='tl-canvas' draggable={false}>
      <ThreeCanvas frameloop='demand'>
        <Scene />
      </ThreeCanvas>
    </div>
  );
}
