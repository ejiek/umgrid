import {Grid, Layout, Ray, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, delay, loop, createRef, createSignal, Reference, waitFor, ThreadGenerator} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const grid = createRef<Grid>();
  const topLayout = createRef<Layout>();
  const scaledLayout = createRef<Layout>();
  const bgGrid: BgGrid = { grid, topLayout, scaledLayout };
  const gridEdge=200;

  const arrow = createRef<Ray>();
  const textUm = createRef<Txt>();
  const textGrid = createRef<Txt>();

  view.add(
    <>
      <Layout
        ref={topLayout}
        height={'100%'}
      >
        <Layout
          ref={scaledLayout}
        >
          <Grid
            ref={grid}
            width={'300%'}
            height={'500%'}
            stroke={'#b3b3b3'}
            start={0.5}
            end={0.5}
            spacing={[gridEdge, gridEdge]}
            lineDash={[4, 4]}
            rotation={45}
          />
        </Layout>
      </Layout>
      <Ray
          ref={arrow}
          lineWidth={8}
          endArrow
          stroke={'#f7b965'}
          from={[-960, 530]}
          to={[-70, 81]}
          end={0}
      />
      <Txt
        ref={textUm}
        text={'Um'}
        position={[1, -22]}
        opacity={0}
      />
      <Txt
        ref={textGrid}
        text={'Grid'}
        position={[1, -22]}
        opacity={0}
      />
    </>
  );

  scaledLayout().bottom(topLayout().bottom);

  yield* all(
    grid().end(1, 1),
    grid().start(0, 1),
    scaledLayout().scale([1, 0.5], 0.5),
  );

  yield* waitFor(1);

  yield* all(
    arrow().end(1,1),
  );

  yield* waitFor(1);

  yield* all (
    gridForward(bgGrid, 1),
    moveWithGrid(textUm),
    delay(0.3 ,textUm().opacity(100, 0.3)),
  );

  yield* waitFor(1);

  yield* all (
    gridForward(bgGrid, 1),
    moveWithGrid(textUm),
    moveWithGrid(textGrid),
    delay(0.3, textGrid().opacity(100, 0.3)),
  );

  yield* waitFor(1);

  yield* all (
    gridForward(bgGrid, 1),
    moveWithGrid(textUm),
    moveWithGrid(textGrid),
  );

  yield* all(
    arrow().lineWidth(0, 1),
    arrow().arrowSize(0, 1),
    textUm().opacity(0, 0.6),
    textGrid().opacity(0, 0.6),
  );

  yield* all(
    grid().end(0.5, 1).wait(1),
    grid().start(0.5, 1).wait(1),
    delay(0.3, scaledLayout().scale([1, 1], 0.5)),
  );
});

function* moveWithGrid(piece: Reference<Txt>): ThreadGenerator {
    const shift = 200 * 1.4142 / 2; // ToDo: get actual grid edge
    yield* piece().position([piece().x()-shift, piece().y()+shift/2], 1);
 }

function* gridForward(grid: BgGrid, delay: number): ThreadGenerator {
  const shift = 200 * 1.4142 / 2; // ToDo: get actual grid edge
  yield* all(
    grid.grid().x(-shift, delay),
    grid.grid().y(shift, delay),
  );
  grid.grid().x(0);
  grid.grid().y(0);
}

class BgGrid {
  grid: Reference<Grid>;
  topLayout: Reference<Layout>;
  scaledLayout: Reference<Layout>;
}
