import { useEffect, useRef } from 'react';
import { from, range, combineLatest } from 'rxjs';
import * as tf from '@tensorflow/tfjs';
import { reduce } from 'rxjs/operators';

const GENE_SIZE = 100;
const GENERATION_SIZE = 90;

const draw = (ctx, [point1, point2, point3, color]) => {
  ctx.clearRect(0, 0, 100, 100);
  for (let i = 0; i < GENE_SIZE; i++) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${color[i]}, ${color[i + 1]}, ${color[i + 2]}, 0.5)`;
    ctx.moveTo(point1[i], point1[i + 1]);
    ctx.lineTo(point2[i], point2[i + 1]);
    ctx.lineTo(point3[i], point3[i + 1]);
    ctx.lineTo(point1[i], point1[i + 1]);
    ctx.fill();
  }
};

const loadImage$ = from(new Promise((resolve) => {
  const ctx = document.createElement('canvas').getContext('2d');
  const image = new Image(100, 100);
  image.src = 'static/ff.jpeg';
  image.onload = () => {
    ctx.drawImage(image, 0, 0, 100, 100);
    resolve(ctx.getImageData(0, 0, 100, 100));
  };
}));

const diff = (ctx, origin) => {
  let image = ctx.getImageData(0, 0, 100, 100);
  let imageTf = tf.tensor(Array.from(image.data));
  let originTf = tf.tensor(Array.from(origin.data));
  let resultTf = imageTf.sub(originTf).pow(2).mean().asScalar();
  const result = resultTf.get();
  imageTf.dispose();
  originTf.dispose();
  resultTf.dispose();
  imageTf = null;
  originTf = null;
  resultTf = null;
  image = null;
  return result;
};

const init = (size = 100) => {
  const point1 = tf.randomUniform([size, 2], 0, 100, 'int32');
  const point2 = tf.randomUniform([size, 2], 0, 100, 'int32');
  const point3 = tf.randomUniform([size, 2], 0, 100, 'int32');
  const color = tf.randomUniform([size, 3], 0, 255, 'int32');
  const result = [Array.from(point1.dataSync()), Array.from(point2.dataSync()), Array.from(point3.dataSync()), Array.from(color.dataSync())];
  point1.dispose();
  point2.dispose();
  point3.dispose();
  color.dispose();
  return result;
};

const P50 = () => Math.random() > 0.5;

const combine = (parent1, parent2) => parent1.map((p, i) => {
  const pa2 = parent2[i];
  return p.map((p1, index) => {
    const P = Math.random();
    if (P > 0.99) {
      if (index === 3) return Math.floor(Math.random() * 255);
      return Math.floor(Math.random() * 100);
    } if (P > 0.495) return p1;
    return pa2[index];
  });
});

const INIT_GENERATIONS$ = range(0, GENERATION_SIZE).pipe(reduce((a, _) => ([...a, init(GENE_SIZE)]), []));


const f = (ctx, origin, members) => {
  const diffs = members.map((member, index) => {
    draw(ctx, member);
    return {
      index,
      d: diff(ctx, origin),
    };
  });
  let indexes = diffs.sort((a, b) => a.d - b.d).slice(0, 10);
  console.log(indexes[0].d);
  indexes = indexes.map(_ => _.index);
  return members.filter((m, index) => indexes.indexOf(index) !== -1);
};

const x = (best) => {
  const next = [];
  for (let i = 0; i < best.length; i++) {
    for (let j = i + 1; j < best.length; j++) {
      next.push(combine(best[i], best[j]));
    }
  }
  for (let i = 0; i < best.length; i++) {
    for (let j = i + 1; j < best.length; j++) {
      next.push(combine(best[i], best[j]));
    }
  }
  return next;
};

const loop = (dom, ctx, ff, members, times) => {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  dom.current.appendChild(canvas);
  const best = f(ctx, ff, members);
  draw(canvas.getContext('2d'), best[0]);
  setTimeout(() => {
    if (times === 10) {
      localStorage.setItem('prev', JSON.stringify(best));
      window.location.reload();
    } else {
      loop(dom, ctx, ff, x(best), times + 1);
    }
  }, 100);
};

export default () => {
  const dom = useRef(null);
  useEffect(() => {
    const ctx = document.createElement('canvas').getContext('2d');
    combineLatest(loadImage$, INIT_GENERATIONS$).subscribe(([ff, members]) => {
      const prev = localStorage.getItem('prev');
      if (prev) {
        loop(dom, ctx, ff, x(JSON.parse(prev)), 0);
      } else {
        loop(dom, ctx, ff, members, 0);
      }
    });
  });
  return (
    <div ref={dom}>
      <img id="ff" src="static/ff.jpeg" alt="ff" style={{ height: 100, width: 100 }} />
    </div>
  );
};
