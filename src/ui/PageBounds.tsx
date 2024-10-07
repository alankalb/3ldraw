import { useEditor, track, TLPageId, Box } from 'tldraw';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';

interface PageBoundsProps {
  id: TLPageId;
  isCurrent?: boolean;
}

export const PageBounds = track(({ id, isCurrent }: PageBoundsProps) => {
  const boundsRef = useRef<THREE.BufferGeometry>(null);
  const editor = useEditor();
  const shapeIds = Array.from(editor.getPageShapeIds(id));

  useEffect(() => {
    if (!isCurrent) return;
    console.log('test');

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

    const bottomLeft = new THREE.Vector3(box.x, box.y, 0);
    const bottomRight = new THREE.Vector3(box.x + box.width, box.y, 0);
    const topLeft = new THREE.Vector3(box.x, box.y + box.height, 0);
    const topRight = new THREE.Vector3(
      box.x + box.width,
      box.y + box.height,
      0
    );
    boundsRef.current.setFromPoints([
      bottomLeft,
      bottomRight,
      topRight,
      topLeft,
      bottomLeft,
    ]);
  }, [editor, shapeIds, isCurrent]);

  return (
    <lineLoop visible={isCurrent}>
      <bufferGeometry ref={boundsRef}></bufferGeometry>
      <lineBasicMaterial color={'white'} />
    </lineLoop>
  );
});

export function compact<T>(arr: T[]): NonNullable<T>[] {
  return arr.filter((i) => i !== undefined && i !== null) as any;
}
