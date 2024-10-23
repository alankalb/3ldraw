import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

import { getPointerInfo, TLCamera, useEditor } from 'tldraw';

const RIGHT_MOUSE_BUTTON = 2;

export function useCanvasEvents() {
  const editor = useEditor();

  const { gl, raycaster } = useThree();
  const selectedPage = editor.getCurrentPage();
  const selectedPageId = editor.getCurrentPageId();
  const camera = editor.getCamera();
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

    function onPointerDown(e: PointerEvent) {
      if ((e as any).isKilled) return;

      const intersection = getPageIntersectionPoint(raycaster.ray);
      if (!intersection) return;

      if (e.button === RIGHT_MOUSE_BUTTON) {
        editor.dispatch({
          type: 'pointer',
          target: 'canvas',
          name: 'right_click',
          ...get3dPointerInfo(e, intersection, camera),
        });
        return;
      }

      if (e.button !== 0 && e.button !== 1 && e.button !== 5) return;

      // setPointerCapture(e.currentTarget, e);

      editor.dispatch({
        type: 'pointer',
        target: 'canvas',
        name: 'pointer_down',
        ...get3dPointerInfo(e, intersection, camera),
      });
    }

    function onPointerUp(e: PointerEvent) {
      if ((e as any).isKilled) return;
      const intersection = getPageIntersectionPoint(raycaster.ray);
      if (!intersection) return;
      if (e.button !== 0 && e.button !== 1 && e.button !== 2 && e.button !== 5)
        return;
      // lastX = e.clientX;
      // lastY = e.clientY;

      // releasePointerCapture(e.currentTarget, e);

      editor.dispatch({
        type: 'pointer',
        target: 'canvas',
        name: 'pointer_up',
        ...get3dPointerInfo(e, intersection, camera),
      });
    }

    function onPointerMove(e: PointerEvent) {
      if ((e as any).isKilled) return;

      const intersection = getPageIntersectionPoint(raycaster.ray);
      if (!intersection) return;

      const pointerInfo = getPointerInfo(e);
      // Adjust pointer info based on zoom to fit camera position
      pointerInfo.point.x = (intersection.x + camera.x) * camera.z;
      pointerInfo.point.y = (-intersection.y + camera.y) * camera.z;

      editor.dispatch({
        type: 'pointer',
        target: 'canvas',
        name: 'pointer_move',
        ...get3dPointerInfo(e, intersection, camera),
      });
    }

    gl.domElement.addEventListener('pointermove', onPointerMove);
    gl.domElement.addEventListener('pointerdown', onPointerDown);
    gl.domElement.addEventListener('pointerup', onPointerUp);

    return () => {
      gl.domElement.removeEventListener('pointermove', onPointerMove);
      gl.domElement.removeEventListener('pointerdown', onPointerDown);
      gl.domElement.removeEventListener('pointerup', onPointerUp);
    };
  }, [selectedPageId, gl, raycaster, editor, pageMatrix, camera]);
}

const get3dPointerInfo = (
  e: PointerEvent,
  intersection: THREE.Vector3,
  camera: TLCamera
) => {
  const pointerInfo = getPointerInfo(e);
  // Adjust pointer info based on zoom to fit camera position
  pointerInfo.point.x = (intersection.x + camera.x) * camera.z;
  pointerInfo.point.y = (-intersection.y + camera.y) * camera.z;

  return pointerInfo;
};
