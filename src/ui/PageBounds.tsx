import { useEditor, track, TLPageId, Box } from 'tldraw';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';

interface PageBoundsProps {
  id: TLPageId;
  isCurrent?: boolean;
}

export const PageBounds = track(({ id, isCurrent }: PageBoundsProps) => {
  const boundsRef = useRef<THREE.Mesh>(null);
  const editor = useEditor();
  const shapeIds = Array.from(editor.getPageShapeIds(id));

  useEffect(() => {
    if (!boundsRef.current) return;
    const bounds = compact(shapeIds.map((id) => editor.getShapePageBounds(id)));

    let box: Box;
    if (bounds.length === 0) {
      box = Box.FromPoints([
        { x: -100, y: -100 },
        { x: 100, y: 100 },
      ]);
    } else {
      box = Box.Common(bounds);
    }

    const plane = new THREE.PlaneGeometry(box.width, box.height);
    boundsRef.current.geometry = plane;
    boundsRef.current.position.set(
      box.width / 2 + box.x,
      box.height / 2 + box.y,
      0
    );
  }, [editor, shapeIds, isCurrent]);

  return (
    <mesh visible={true} ref={boundsRef}>
      <meshBasicMaterial
        color={isCurrent ? 'yellow' : 'white'}
        transparent
        opacity={0.05}
        side={THREE.DoubleSide}
        polygonOffset
        polygonOffsetFactor={0.1}
        depthTest={false}
      />
    </mesh>
  );
});

export function compact<T>(arr: T[]): NonNullable<T>[] {
  return arr.filter((i) => i !== undefined && i !== null) as any;
}
