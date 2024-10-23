import { useEditor, track, TLShapeId } from 'tldraw';
import { renderToString } from 'react-dom/server';
import { SvgMesh } from './SvgMesh';
import { ShapeIndicator } from './ShapeIndicator';

interface TlShapeProps {
  id: TLShapeId;
  renderOrder: number;
}

export const TlShape = track(({ id, renderOrder }: TlShapeProps) => {
  const editor = useEditor();
  const isHovered = editor.getHoveredShapeId() === id;
  const isSelected = editor.getSelectedShapeIds().includes(id);
  const shape = editor.getShape(id);

  if (!shape) return;
  const shapeUtil = editor.getShapeUtil(shape.type);

  if (!shapeUtil) return;
  const shapeComponent = shapeUtil.component(shape);
  const svg = renderToString(shapeComponent);
  const shapeIndicator = shapeUtil.indicator(shape);
  const indicatorSvg = renderToString(shapeIndicator);
  const style = getComputedStyle(editor.getContainer());
  const selectColor = style.getPropertyValue('--color-selected');

  return (
    <group position={[shape.x, shape.y, 0]}>
      <SvgMesh svg={svg} renderOrder={renderOrder} />
      <ShapeIndicator
        svg={indicatorSvg}
        visible={isHovered || isSelected}
        strokeColor={selectColor}
      />
    </group>
  );
});
