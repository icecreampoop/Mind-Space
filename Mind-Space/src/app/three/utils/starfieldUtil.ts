import * as THREE from "three";

let timeoutIds = [];

//to stop blinkStarField lol cus not disposed by renderer
export function stopRecursiveStarfieldBlink() {
  timeoutIds.forEach((timeoutId) => {
    clearTimeout(timeoutId);
  });

  timeoutIds = []; // Clear the array
}

export function blinkStarField(points: THREE.Points) {
  const materials = Array.isArray(points.material) ? points.material : [points.material];

  //blink effect
  materials.forEach((mat) => {
    mat.visible = !mat.visible;
  });
  setTimeout(() => {
    materials.forEach((mat) => {
      mat.visible = !mat.visible;
    });
  } , 300);

  // Toggle visibility after a random interval
  const timeoutId = setTimeout(() => {
    blinkStarField(points); // Call the function recursively
  }, Math.random() * 10000 + 6000);

  timeoutIds.push(timeoutId);
}

export function moveStarField(starfield: THREE.Points) {
  const time = performance.now() * 0.0003;
  const positions = starfield.geometry.attributes['position'];

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);

    const radius = 50;
    const speed = 0.1;
    const angle = time * speed + i * 0.1;
    const newX = Math.cos(angle) * radius;
    const newY = y;
    const newZ = Math.sin(angle) * radius;

    positions.setXYZ(i, newX, newY, newZ);
  }
  
  positions.needsUpdate = true;
}

export default function createStarfield({ numStars = 1500 } = {}) {
  //function to generate the 3d position of star
  function randomSpherePoint() {
    const radius = Math.random() * 25 + 25;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    let x = radius * Math.sin(phi) * Math.cos(theta);
    let y = radius * Math.sin(phi) * Math.sin(theta);
    let z = radius * Math.cos(phi);

    return {
      pos: new THREE.Vector3(x, y, z),
      hue: 0.6,
      minDist: radius,
    };
  }

  const verts = [];
  const colors = [];
  const positions = [];
  let col: THREE.Color;

  for (let i = 0; i < numStars; i += 1) {
    let p = randomSpherePoint();
    //lol this piece of code is p cool, extracting 2 individual variables from p, which are the pos and hue
    const { pos, hue } = p;
    positions.push(p);
    col = new THREE.Color().setHSL(hue, 0.2, Math.random());
    verts.push(pos.x, pos.y, pos.z);
    colors.push(col.r, col.g, col.b);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    map: new THREE.TextureLoader().load(
      "assets/star.png"
    ),
  });

  //quite magic also, points automatically detect if buffer geometry means array of objects, no need loop
  const points = new THREE.Points(geo, mat);
  return points;
}