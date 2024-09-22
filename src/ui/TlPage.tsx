import { useEditor, track, TLPageId } from 'tldraw';
import * as THREE from 'three';
import { useRef } from 'react';
import { TlShape } from './TlShape';
import { CameraControls, PivotControls } from '@react-three/drei';

interface TlPageProps {
  id: TLPageId;
  isCurrent?: boolean;
  cameraControls: CameraControls | null;
}

export const TlPage = track(
  ({ id, isCurrent, cameraControls }: TlPageProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const editor = useEditor();
    const page = editor.getPage(id);
    const shapeIds = Array.from(editor.getPageShapeIds(id));

    const handlePageSelect = () => {
      if (isCurrent) return;
      editor.setCurrentPage(id);
    };

    const handleDragStart = () => {
      if (!cameraControls) return;
      cameraControls.enabled = false;
    };

    const handleDragEnd = () => {
      if (!cameraControls) return;
      cameraControls.enabled = true;
      if (!groupRef.current) return;
      editor.updatePage({
        id,
        meta: { matrix: groupRef.current.matrix.toArray() },
      });
    };

    if (!page) return;

    const pageMatrix = page.meta.matrix as undefined | number[];

    return (
      <PivotControls
        ref={groupRef}
        depthTest={false}
        lineWidth={3}
        anchor={[0, 0, 0]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        disableScaling
        visible={isCurrent}
        matrix={
          pageMatrix ? new THREE.Matrix4().fromArray(pageMatrix) : undefined
        }
      >
        <group onClick={handlePageSelect} scale={[1,-1,1]}>
          {shapeIds.map((shapeId, i) => (
            <TlShape id={shapeId} key={shapeId} renderOrder={i} />
          ))}
        </group>
      </PivotControls>
    );
  }
);
