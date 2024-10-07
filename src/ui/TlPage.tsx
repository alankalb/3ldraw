import { useEditor, track, TLPageId } from 'tldraw';
import * as THREE from 'three';
import { useRef } from 'react';
import { TlShape } from './TlShape';
import { CameraControls, Line, PivotControls } from '@react-three/drei';
import { PageBounds } from './PageBounds';

interface TlPageProps {
  id: TLPageId;
  isCurrent?: boolean;
  cameraControls: CameraControls | null;
}

export const TlPage = track(
  ({ id, isCurrent, cameraControls }: TlPageProps) => {
    const pivotRef = useRef<THREE.Group>(null);
    const groupRef = useRef<THREE.Group>(null);
    const editor = useEditor();
    const page = editor.getPage(id);
    const shapeIds = Array.from(editor.getPageShapeIds(id));

    if (!page) return;

    const handlePageSelect = () => {
      if (isCurrent) return;
      editor.setCurrentPage(id);
    };

    const handleDragStart = () => {
      if (!cameraControls) return;
      cameraControls.enabled = false;
    };

    const handleDragEnd = () => {
      if (cameraControls) {
        cameraControls.enabled = true;
      }

      if (!pivotRef.current) return;
      editor.updatePage({
        id,
        meta: { matrix: pivotRef.current.matrix.toArray() },
      });
    };

    const pageMatrix = page.meta.matrix as undefined | number[];

    return (
      <PivotControls
        ref={pivotRef}
        depthTest={false}
        lineWidth={3}
        anchor={[0, 0, 0]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        disableScaling
        enabled={isCurrent}
        visible={isCurrent}
        matrix={
          pageMatrix ? new THREE.Matrix4().fromArray(pageMatrix) : undefined
        }
      >
        <group ref={groupRef} onClick={handlePageSelect} scale={[1, -1, 1]}>
          <PageBounds id={id} isCurrent={isCurrent} />
          {!shapeIds.length && (
            <Line
              visible={false}
              points={[
                [1, 1, 0],
                [-1, -1, 0],
              ]}
            />
          )}
          {shapeIds.map((shapeId, i) => (
            <TlShape id={shapeId} key={shapeId} renderOrder={i} />
          ))}
        </group>
      </PivotControls>
    );
  }
);
