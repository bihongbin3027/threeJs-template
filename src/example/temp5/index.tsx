/*
 * @Description 光源
 * @Author bihongbin
 * @Date 2021-08-18 15:44:03
 * @LastEditors bihongbin
 * @LastEditTime 2021-08-18 17:56:09
 */
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import BaseClass from '../../baseClass';

export default class ThreeTemplate5 extends BaseClass {
  // 场景
  scene: THREE.Scene;
  // 渲染器
  canvas: THREE.WebGLRenderer;
  // 摄像机
  camera: THREE.PerspectiveCamera;
  // 控制器
  controls: any;

  constructor() {
    super();

    // 创建场景
    this.scene = this.createScene();
    // 创建渲染器
    this.canvas = this.createCanvas();
    // 创建透视摄像机
    this.camera = this.createCamera();
    // 创建控制器
    this.controls = this.createControls();
  }

  // 场景
  createScene() {
    const scene = new THREE.Scene();
    return scene;
  }

  // 渲染器
  createCanvas() {
    const canvas = new THREE.WebGLRenderer();
    canvas.setClearColor(0xaaaaaa);
    document.body.appendChild(canvas.domElement);
    return canvas;
  }

  // 透视摄像机
  createCamera(fov = 45) {
    // canvas 的默认宽高 300:150
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);
    // 透视摄像机自适应渲染
    super.resizePerspectiveCameraDisplaySize(this.canvas, camera);
    return camera;
  }

  // 控制器
  createControls() {
    const controls = new OrbitControls(this.camera, this.canvas.domElement);
    controls.target.set(0, 5, 0);
    controls.update();
    return controls;
  }

  render() {
    this.canvas.render(this.scene, this.camera);
  }
}
