import { useEditor, track, TLShapeId } from 'tldraw';
import { renderToString } from 'react-dom/server';
import { SvgMesh } from './SvgMesh';

interface TlShapeProps {
  id: TLShapeId;
  renderOrder: number;
}

const SCALE = 0.01;

export const TlShape = track(({ id, renderOrder }: TlShapeProps) => {
  const editor = useEditor();
  const shape = editor.getShape(id);

  if (!shape) return;
  const shapeUtil = editor.getShapeUtil(shape.type);
  if (!shapeUtil) return;
  const shapeComponent = shapeUtil.component(shape);
  const svg = renderToString(shapeComponent);

  return (
    <group
      position={[shape.x * SCALE, shape.y * SCALE, 0]}
      scale={[SCALE, SCALE, SCALE]}
    >
      <SvgMesh svg={svg} renderOrder={renderOrder} />
    </group>
  );
});
