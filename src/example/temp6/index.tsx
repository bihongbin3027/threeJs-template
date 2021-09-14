/*
 * @Description 阴影
 * @Author bihongbin
 * @Date 2021-09-14 11:09:18
 * @LastEditors bihongbin
 * @LastEditTime 2021-09-14 11:49:13
 */
import * as THREE from 'three';
import { OrbitControls } from '@three-ts/orbit-controls';
import BaseClass from '@/baseClass';
import checker from '@/images/checker.png';

export default class ThreeTemplate6 extends BaseClass {
  // 场景
  scene: THREE.Scene;
  // 渲染器
  canvas: THREE.WebGLRenderer;
  // 透视摄像机
  camera: THREE.PerspectiveCamera;
  // 轨道控制器
  orbitControls: OrbitControls;

  constructor() {
    super();

    // 创建场景
    this.scene = this.createScene();
    // 创建渲染器
    this.canvas = this.createCanvas();
    // 创建透视摄像机
    this.camera = this.createPerspectiveCamera();
    // 创建轨道控制器
    this.orbitControls = this.createOrbitControls();
  }

  // 场景
  createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('white');
    return scene;
  }

  // 渲染器
  createCanvas() {
    const canvas = new THREE.WebGLRenderer();
    document.body.appendChild(canvas.domElement);
    return canvas;
  }

  // 透视摄像机
  createPerspectiveCamera() {
    const fov = 45;
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 30);
    // 透视摄像机自适应渲染
    super.resizePerspectiveCameraDisplaySize(this.canvas, camera);
    return camera;
  }

  // 创建轨道控制器
  createOrbitControls() {
    const controls = new OrbitControls(this.camera, this.canvas.domElement);
    controls.autoRotate = true;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.addEventListener('change', this.render.bind(this));
    return controls;
  }

  render() {
    this.canvas.render(this.scene, this.camera);
  }
}
