import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

interface ShapeIndicatorProps {
  svg: string;
  strokeColor: string;
  visible?: boolean;
}

export const ShapeIndicator = ({
  svg,
  strokeColor,
  visible = true,
}: ShapeIndicatorProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const loader = useMemo(() => new SVGLoader(), []);

  useEffect(() => {
    if (!groupRef.current) return;
    const group = groupRef.current;
    const parsedSvg = loader.parse(svg);
    const { paths } = parsedSvg;

    for (const path of paths) {
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setStyle(strokeColor),
        side: THREE.DoubleSide,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });

      for (const subPath of path.subPaths) {
        const geometry = SVGLoader.pointsToStroke(
          subPath.getPoints(),
          path.userData?.style
        );

        if (geometry) {
          const mesh = new THREE.Mesh(geometry, material);
          mesh.renderOrder = Number.MAX_SAFE_INTEGER;
          group.add(mesh);
        }
      }
    }

    return () => {
      group.children.length = 0;
    };
  }, [svg, loader, strokeColor]);

  return <group ref={groupRef} visible={visible} />;
};
