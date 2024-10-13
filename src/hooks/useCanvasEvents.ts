import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';

import { Box, getPointerInfo, useEditor } from 'tldraw';

export function useCanvasEvents() {
  const editor = useEditor();

  const { gl, raycaster, scene } = useThree();
  const selectedPage = editor.getCurrentPage();
  const selectedPageId = editor.getCurrentPageId();
  const pageMatrix = selectedPage.meta.matrix as number[] | undefined;

  useEffect(() => {
    // Zoom to fit camera to current page so TlDraw thinks all shapes are rendering
    editor.zoomToFit();
  }, [selectedPageId, pageMatrix]);

  useEffect(() => {
    const matrix = new THREE.Matrix4();
    if (pageMatrix) {
      matrix.fromArray(pageMatrix);
    }
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.extractRotation(matrix);
    const inverseMatrix = new THREE.Matrix4().copy(matrix);
    inverseMatrix.invert();

    const planeNormal = new THREE.Vector3(0, 0, 1).applyMatrix4(rotationMatrix);
    const planeConstant = new THREE.Vector3()
      .setFromMatrixPosition(matrix)
      .dot(planeNormal);
    const intersectPlane = new THREE.Plane(planeNormal, -planeConstant);

    const getPageIntersectionPoint = (ray: THREE.Ray) => {
      const intersection = ray.intersectPlane(
        intersectPlane,
        new THREE.Vector3()
      );
      if (!intersection) return null;
      intersection.applyMatrix4(inverseMatrix);

      return intersection;
    };

    const handleMouseMove = (event: PointerEvent) => {
      const intersection = getPageIntersectionPoint(raycaster.ray);
      if (!intersection) return;

      const camera = editor.getCamera();

      const pointerInfo = getPointerInfo(event);
      // Adjust pointer info based on zoom to fit camera position
      pointerInfo.point.x = (intersection.x + camera.x) * camera.z;
      pointerInfo.point.y = (-intersection.y + camera.y) * camera.z;

      editor.dispatch({
        type: 'pointer',
        target: 'canvas',
        name: 'pointer_move',
        ...pointerInfo,
      });
    };

    gl.domElement.addEventListener('pointermove', handleMouseMove);

    return () => {
      gl.domElement.removeEventListener('pointermove', handleMouseMove);
    };
  }, [selectedPageId, gl, raycaster, editor, pageMatrix]);
}
