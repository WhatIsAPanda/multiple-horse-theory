const field = document.querySelector("#field");
const horses = [];
const HORSE_LIMIT = 128;
const MIN_SPEED = 105;
const MAX_SPEED = 175;
const SPLIT_ANGLE = Math.PI / 12;

const random = (min, max) => Math.random() * (max - min) + min;

function fieldSize() {
  return { width: window.innerWidth, height: window.innerHeight };
}

function makeVelocity() {
  const angle = random(0, Math.PI * 2);
  const speed = random(MIN_SPEED, MAX_SPEED);
  return { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
}

function createHorse(x, y, vx, vy) {
  const element = document.createElement("div");
  element.className = "horse";
  element.style.visibility = "hidden";

  const image = document.createElement("img");
  image.src = "horse.svg";
  image.alt = "";
  image.draggable = false;
  element.append(image);
  field.append(element);

  const horse = {
    element,
    x,
    y,
    vx,
    vy,
    width: element.offsetWidth,
    height: element.offsetHeight,
    collisionLock: 0,
    rotation: 0,
    angularVelocity: 0,
  };

  horses.push(horse);
  return horse;
}

function duplicateHorse(source, hitX, hitY) {
  if (horses.length >= HORSE_LIMIT) return;

  // Both horses must leave the wall, otherwise the clone immediately hits the
  // same edge and falls back into its parent's path. The clone instead takes
  // the opposite tangent, plus a small variation to prevent synchronization.
  let cloneVx = hitX ? source.vx : -source.vx;
  let cloneVy = hitY ? source.vy : -source.vy;
  const angle = random(-SPLIT_ANGLE, SPLIT_ANGLE);
  const speedVariation = random(0.88, 1.12);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const rotatedVx = (cloneVx * cos - cloneVy * sin) * speedVariation;
  const rotatedVy = (cloneVx * sin + cloneVy * cos) * speedVariation;

  cloneVx = rotatedVx;
  cloneVy = rotatedVy;

  // Rotation can point a shallow trajectory back through the collision edge.
  // Preserve its inward-facing component while keeping the tangential split.
  if (hitX) cloneVx = Math.abs(cloneVx) * Math.sign(source.vx || 1);
  if (hitY) cloneVy = Math.abs(cloneVy) * Math.sign(source.vy || 1);

  const clone = createHorse(
    source.x + (hitX ? Math.sign(source.vx) * 3 : 0),
    source.y + (hitY ? Math.sign(source.vy) * 3 : 0),
    cloneVx,
    cloneVy,
  );
  const bounds = fieldSize();

  clone.x = Math.min(Math.max(0, clone.x), bounds.width - clone.width);
  clone.y = Math.min(Math.max(0, clone.y), bounds.height - clone.height);
  clone.collisionLock = 0.12;
  clone.angularVelocity = -source.angularVelocity;
  placeHorse(clone);
}

function placeHorse(horse) {
  const facing = horse.vx < 0 ? -1 : 1;
  horse.element.style.transform =
    `translate3d(${horse.x}px, ${horse.y}px, 0) rotate(${horse.rotation}rad) scaleX(${facing})`;
  horse.element.style.visibility = "visible";
}

function moveHorse(horse, delta) {
  const bounds = fieldSize();
  const maxX = Math.max(0, bounds.width - horse.width);
  const maxY = Math.max(0, bounds.height - horse.height);
  let hitX = false;
  let hitY = false;

  horse.x += horse.vx * delta;
  horse.y += horse.vy * delta;
  horse.collisionLock = Math.max(0, horse.collisionLock - delta);

  // A damped spring turns each collision kick into a small tilt, then settles
  // the silhouette back to level instead of allowing continuous spinning.
  horse.angularVelocity +=
    (-horse.rotation * 44 - horse.angularVelocity * 10) * delta;
  horse.rotation += horse.angularVelocity * delta;

  if (horse.x <= 0 && horse.vx < 0) {
    horse.x = 0;
    horse.vx *= -1;
    hitX = true;
  } else if (horse.x >= maxX && horse.vx > 0) {
    horse.x = maxX;
    horse.vx *= -1;
    hitX = true;
  }

  if (horse.y <= 0 && horse.vy < 0) {
    horse.y = 0;
    horse.vy *= -1;
    hitY = true;
  } else if (horse.y >= maxY && horse.vy > 0) {
    horse.y = maxY;
    horse.vy *= -1;
    hitY = true;
  }

  if ((hitX || hitY) && horse.collisionLock === 0) {
    horse.collisionLock = 0.12;
    horse.angularVelocity +=
      (Math.random() < 0.5 ? -1 : 1) * random(3.2, 4.8);
    duplicateHorse(horse, hitX, hitY);
  }

  placeHorse(horse);
}

function resizeHorses() {
  const bounds = fieldSize();

  horses.forEach((horse) => {
    horse.width = horse.element.offsetWidth;
    horse.height = horse.element.offsetHeight;
    horse.x = Math.min(horse.x, Math.max(0, bounds.width - horse.width));
    horse.y = Math.min(horse.y, Math.max(0, bounds.height - horse.height));
    placeHorse(horse);
  });
}

const initialVelocity = makeVelocity();
const starter = createHorse(0, 0, initialVelocity.vx, initialVelocity.vy);
const initialBounds = fieldSize();
starter.x = random(0, Math.max(0, initialBounds.width - starter.width));
starter.y = random(0, Math.max(0, initialBounds.height - starter.height));
placeHorse(starter);

let previousTime = performance.now();

function animate(now) {
  const delta = Math.min((now - previousTime) / 1000, 0.033);
  previousTime = now;

  // Take a snapshot so newborn horses begin moving on the following frame.
  [...horses].forEach((horse) => moveHorse(horse, delta));
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeHorses);
requestAnimationFrame(animate);
