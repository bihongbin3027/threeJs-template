/*
 * @Description 球体
 * @Author bihongbin
 * @Date 2021-08-13 09:55:53
 * @LastEditors bihongbin
 * @LastEditTime 2021-08-13 15:05:01
 */
import * as THREE from 'three';

export default class ThreeTemplate2 {
  // 渲染器
  webGl: THREE.WebGLRenderer;
  // 透视摄像机
  camera: THREE.PerspectiveCamera;
  // 场景
  scene: THREE.Scene;
  // 灯光
  light: THREE.AmbientLight;
  // 轴
  axes: THREE.AxesHelper;

  constructor() {
    this.scene = new THREE.Scene(); // 场景
    this.webGl = this.createRender(); // 渲染器
    this.camera = this.createCamera(); // 相机
    this.axes = this.showAxes(); // 轴
    this.light = this.createLight(); // 光
    this.addSphere(); // 添加球体
  }

  // 显示在屏幕的轴
  showAxes() {
    const axes = new THREE.AxesHelper(20);
    this.scene.add(axes);
    return axes;
  }

  // 渲染器
  createRender() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight); // 设置尺寸
    document.body.appendChild(renderer.domElement);
    return renderer;
  }

  // 创建相机
  createCamera() {
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(-30, 40, 30);
    camera.lookAt(this.scene.position);
    return camera;
  }

  // 创建光
  createLight() {
    const ambienLight = new THREE.AmbientLight(0xffffff); // 环境光
    this.scene.add(ambienLight);
    return ambienLight;
  }

  // 添加球体
  addSphere() {
    // 定义物体的几何结构
    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    // 定义物体的材质
    const sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x7777ff,
    });
    // 用几何结构和材质来创建物体
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // 定位球体中心的位置
    sphere.position.set(15, 0, 0);
    // 把球体添加进场景中
    this.scene.add(sphere);
  }

  render() {
    this.webGl.render(this.scene, this.camera);
  }
}
