/*
 * @Description 围绕局部空间旋转
 * @Author bihongbin
 * @Date 2021-08-13 14:49:26
 * @LastEditors bihongbin
 * @LastEditTime 2021-08-13 17:52:42
 */
import * as THREE from 'three';
import BaseClass from '../../baseClass';

export default class ThreeTemplate3 extends BaseClass {
  // 场景
  scene: THREE.Scene;
  // 渲染器
  canvas: THREE.WebGLRenderer;
  // 摄像机
  camera: THREE.PerspectiveCamera;
  // 太阳系
  solarSystem = new THREE.Object3D();
  // 星球
  objects: THREE.Mesh[] = [];

  constructor() {
    super();
    // 创建场景
    this.scene = new THREE.Scene();
    // 创建渲染器
    this.canvas = this.createCanvas();
    // 创建摄像机
    this.camera = this.createCamera();

    // 组织星球
    this.orgPlanet();
  }

  // 创建场景
  createScene() {
    const scene = new THREE.Scene();
    const light = new THREE.PointLight(0xffffff, 3); // 添加灯光(亮度是3)
    scene.add(light);
    return scene;
  }

  // 创建渲染器
  createCanvas() {
    const renderer = new THREE.WebGLRenderer();
    document.body.appendChild(renderer.domElement);
    return renderer;
  }

  // 创建摄像机
  createCamera() {
    const camera = new THREE.PerspectiveCamera(40, 2, 0.1, 1000);
    camera.position.set(0, 50, 0);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);
    return camera;
  }

  // 创建基本球体
  createSphere() {
    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6;
    const sphereGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments,
    );
    return sphereGeometry;
  }

  // 创建太阳
  createSun() {
    const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
    const sunMesh = new THREE.Mesh(this.createSphere(), sunMaterial);
    sunMesh.scale.set(5, 5, 5); // 扩大太阳的大小
    this.solarSystem.add(sunMesh);
    this.objects.push(sunMesh);
  }

  // 创建地球
  createEarth() {
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
    });
    const earthMesh = new THREE.Mesh(this.createSphere(), earthMaterial);
    earthMesh.position.x = 10;
    this.solarSystem.add(earthMesh);
    this.objects.push(earthMesh);
  }

  // 组织星球
  orgPlanet() {
    this.createSun(); // 太阳
    this.createEarth(); // 地球
    this.scene.add(this.solarSystem);
  }

  // 渲染内容
  render() {
    const objects = this.objects;
    const animationContent = (time?: number) => {
      time *= 0.001;

      objects.forEach((obj) => {
        obj.rotation.y = time;
      });

      super.resizeRendererToDisplaySize(this.canvas, this.camera);
      this.canvas.render(this.scene, this.camera);

      requestAnimationFrame(animationContent);
    };
    animationContent();
  }
}
