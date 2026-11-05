export const wavePoints = ({ width, wavelength, amplitude, centre, phase = 0, step = 12 }) => {
  const points = [];
  for (let x = 0; x <= width; x += step) {
    points.push([x, centre + amplitude * Math.sin(((x / wavelength) + phase) * Math.PI * 2)]);
  }
  if (points[points.length - 1][0] !== width) {
    points.push([width, centre + amplitude * Math.sin(((width / wavelength) + phase) * Math.PI * 2)]);
  }
  return points;
};

export const pathFrom = (points) => points
  .map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(2)}`)
  .join(' ');

export const lengthOf = (points) => points.reduce((sum, p, i) => (i ? sum + Math.hypot(p[0] - points[i - 1][0], p[1] - points[i - 1][1]) : 0), 0);

