import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

interface SvgMeshProps {
  svg: string;
  renderOrder: number;
}

export const SvgMesh = ({ svg, renderOrder }: SvgMeshProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const loader = useMemo(() => new SVGLoader(), []);

  useEffect(() => {
    if (!groupRef.current) return;
    const { paths } = loader.parse(svg);

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];

      const material = new THREE.MeshBasicMaterial({
        color: path.color,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -renderOrder * 0.1,
      });

      const shapes = SVGLoader.createShapes(path);

      for (let j = 0; j < shapes.length; j++) {
        const shape = shapes[j];
        const geometry = new THREE.ShapeGeometry(shape);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.renderOrder = renderOrder;
        groupRef.current.add(mesh);
      }
    }
  }, [svg]);

  return <group ref={groupRef} />;
};
