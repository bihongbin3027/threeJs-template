import * as THREE from 'three';
import '@/style/global.css';

// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(300, 150);
document.body.appendChild(renderer.domElement);

const fov = 75; // 视野范围 垂直方向75度
const aspect = 2; // 画布宽高比 默认300x150 所以宽高比为300/150=2
const near = 0.1,
  far = 5; // 近平面、远平面 限制了摄像机面朝方向的可绘区域，任何距离小于或超过这个范围的物体都将被裁剪掉(不绘制)
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far); // 透视摄像机
camera.position.z = 2; // 往后移一下摄像机才能显示物体

// 场景
const scene = new THREE.Scene();

// 立方几何体
const geometry = new THREE.BoxGeometry(1, 1, 1);

// 材质
const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });

// 网格
const cube = new THREE.Mesh(geometry, material);

// 将网格添加到场景中
scene.add(cube);

function render(time?: number) {
  time *= 0.001;

  cube.rotation.x = time;
  cube.rotation.y = time;

  // 场景和摄像机传递给渲染器
  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

render();

// // 渲染器
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // 场景
// const scene = new THREE.Scene();

// // 透视摄像机，参数：视野角度、长宽比、近截面、远截面
// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   100,
// );
// camera.position.z = 10;

// // 创建立方体
// const geometry = new THREE.BoxGeometry();
// // 材质
// const material = new THREE.MeshMatcapMaterial({ color: 0x00ff00 });
// // 网格
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// // 渲染循环
// function animate() {
//   requestAnimationFrame(animate);
//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;
//   renderer.render(scene, camera);
// }

// animate();
