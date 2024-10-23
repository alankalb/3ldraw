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
    const group = groupRef.current;
    const parsedSvg = loader.parse(svg);
    const { paths } = parsedSvg;

    for (const path of paths) {
      const fillColor = path.userData?.style.fill;

      if (fillColor !== undefined && fillColor !== 'none') {
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setStyle(fillColor),
          opacity: path.userData?.style.fillOpacity,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
        });

        const shapes = SVGLoader.createShapes(path);

        for (const shape of shapes) {
          const geometry = new THREE.ShapeGeometry(shape);
          const mesh = new THREE.Mesh(geometry, material);
          mesh.renderOrder = renderOrder++;

          groupRef.current.add(mesh);
        }
      }

      const strokeColor = path.userData?.style.stroke;

      if (strokeColor !== undefined && strokeColor !== 'none') {
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setStyle(strokeColor),
          opacity: path.userData?.style.strokeOpacity,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
        });

        for (const subPath of path.subPaths) {
          const geometry = SVGLoader.pointsToStroke(
            subPath.getPoints(),
            path.userData?.style
          );

          if (geometry) {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.renderOrder = renderOrder++;

            groupRef.current.add(mesh);
          }
        }
      }
    }

    return () => {
      group.children.length = 0;
    };
  }, [svg]);

  return <group ref={groupRef} />;
};
