import * as THREE from 'three';
import '@/style/global.css';

// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const fov = 75; // 视野范围 垂直方向75度
const aspect = 2; // 画布宽高比 默认300x150 所以宽高比为300/150=2
const near = 0.1,
  far = 5; // 近平面、远平面 限制了摄像机面朝方向的可绘区域，任何距离小于或超过这个范围的物体都将被裁剪掉(不绘制)
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far); // 透视摄像机
camera.position.z = 4; // 往后移一下摄像机才能显示物体

// 场景
const scene = new THREE.Scene();

// 立方几何体
const geometry = new THREE.BoxGeometry(1, 1, 1);

// 添加灯光效果
{
  const color = 0xFFFFFF
  const intensity = 1
  const light = new THREE.DirectionalLight(color, intensity)
  light.position.set(-1, 2, 4)
  scene.add(light)
}

function makeInstance(geometry: THREE.BoxGeometry, color: number, x: number) {
  // 材质
  const material = new THREE.MeshPhongMaterial({ color })

  // 网格
  const cube = new THREE.Mesh(geometry, material)

  // 网格加入到场景
  scene.add(cube)

  // 设置立方体位置
  cube.position.x = x

  return cube
}

const cubes = [
  makeInstance(geometry, 0x8844aa, -2),
  makeInstance(geometry, 0x44aa88,  0),
  makeInstance(geometry, 0xaa8844,  2),
];

function render(time?: number) {
  time *= 0.001;

  cubes.forEach((cube, ndx) => {
    const speed = 1 + ndx * .1
    const rot = time * speed
    cube.rotation.x = rot
    cube.rotation.y = rot
  })

  // 场景和摄像机传递给渲染器
  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

render();
