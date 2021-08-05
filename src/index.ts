import * as THREE from 'three';
import '@/style/global.css';

// 场景
const scene = new THREE.Scene();
// 透视摄像机，参数：视野角度、长宽比、近截面、远截面
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);

// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建立方体
const geometry = new THREE.BoxGeometry();
// 材质
const material = new THREE.MeshMatcapMaterial({ color: 0x00ff00 });
// 网格
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// 渲染循环
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
