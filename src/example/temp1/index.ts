/*
 * @Description 多个立方体旋转
 * @Author bihongbin
 * @Date 2021-08-13 09:53:51
 * @LastEditors biHongBin
 * @LastEditTime 2021-08-14 22:43:12
 */
import * as THREE from 'three';
import BaseClass from '../../baseClass';

export default class ThreeTemplate1 extends BaseClass {
  // 渲染器
  webGl: THREE.WebGLRenderer;
  // 透视摄像机
  camera: THREE.PerspectiveCamera;
  // 场景
  scene: THREE.Scene;
  // 灯光
  light: THREE.DirectionalLight;

  constructor() {
    super();
    this.scene = this.createScene(); // 场景
    this.webGl = this.createRender(); // 渲染器
    this.camera = this.setCamera(); // 配置摄像机
    this.light = this.addLight(); // 添加灯光
    // 透视摄像机自适应渲染
    this.resizePerspectiveCameraDisplaySize(this.webGl, this.camera);
  }

  // 场景
  createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);
    return scene;
  }

  // 渲染器
  createRender() {
    const renderer = new THREE.WebGLRenderer();
    // renderer.setSize(window.innerWidth, window.innerHeight); // 设置尺寸
    document.body.appendChild(renderer.domElement);
    return renderer;
  }

  // 配置摄像机
  setCamera() {
    const fov = 40; // 视野范围 垂直方向75度
    const aspect = 2; // 画布宽高比 默认300x150 所以宽高比为300/150=2
    const near = 0.1,
      far = 1000; // 近平面、远平面 限制了摄像机面朝方向的可绘区域，任何距离小于或超过这个范围的物体都将被裁剪掉(不绘制)
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 20;
    return camera;
  }

  // 添加灯光
  addLight() {
    const color = 0xffffff;
    const intensity = 1; // 强度
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this.scene.add(light);
    return light;
  }

  // 生成实例
  makeInstance(geometry: THREE.BoxGeometry, color: number, x: number) {
    // 材质
    const material = new THREE.MeshPhongMaterial({ color });
    // 网格
    const cube = new THREE.Mesh(geometry, material);
    // 设置网格位置
    cube.position.x = x;
    // 网格添加到场景
    this.scene.add(cube);
    return cube;
  }

  // 创建多个网格的立方体
  render() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const cubes = [
      this.makeInstance(geometry, 0x8844aa, -2),
      this.makeInstance(geometry, 0x44aa88, 0),
      this.makeInstance(geometry, 0xaa8844, 2),
    ];
    const content = (time?: number) => {
      time *= 0.001;

      cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });

      // 场景和摄像机传递给渲染器
      this.webGl.render(this.scene, this.camera);
      // 动画
      requestAnimationFrame(content);
    };
    content();
  }
}
