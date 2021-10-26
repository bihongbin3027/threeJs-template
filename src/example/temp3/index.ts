/*
 * @Description 围绕局部空间旋转
 * @Author bihongbin
 * @Date 2021-08-13 14:49:26
 * @LastEditors biHongBin
 * @LastEditTime 2021-08-14 23:22:49
 */
import * as THREE from "three";
import BaseClass from "../../baseClass";

export default class ThreeTemplate3 extends BaseClass {
  // 场景
  scene: THREE.Scene;
  // 渲染器
  canvas: THREE.WebGLRenderer;
  // 摄像机
  camera: THREE.PerspectiveCamera;
  // 所有对象
  objects: any[] = [];
  // 太阳3D
  solarSystem = new THREE.Object3D();
  // 地球3D
  earthOrbit = new THREE.Object3D();
  // 月亮3D
  moonOrbit = new THREE.Object3D();

  constructor() {
    super();
    // 创建场景
    this.scene = this.createScene();
    // 创建渲染器
    this.canvas = this.createCanvas();
    // 创建摄像机
    this.camera = this.createCamera();
    // 透视摄像机自适应渲染
    super.resizePerspectiveCameraDisplaySize(this.canvas, this.camera);

    // 组织星球
    this.orgPlanet();
  }

  // 创建场景
  createScene() {
    const scene = new THREE.Scene();
    const light = new THREE.PointLight(0xffffff, 3); // 添加灯光(亮度是3)
    this.solarSystem.position.x = 0;
    this.earthOrbit.position.x = 10;
    this.moonOrbit.position.x = 2;
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
      heightSegments
    );
    return sphereGeometry;
  }

  // 创建太阳
  createSun() {
    const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
    const sunMesh = new THREE.Mesh(this.createSphere(), sunMaterial);
    sunMesh.scale.set(5, 5, 5); // 扩大太阳的大小
    this.solarSystem.add(sunMesh);
    this.objects.push(this.solarSystem);
    super.makeAxisGrid(this.solarSystem, "solarSystem", 26);
    super.makeAxisGrid(sunMesh, "sunMesh");
  }

  // 创建地球
  createEarth() {
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
    });
    const earthMesh = new THREE.Mesh(this.createSphere(), earthMaterial);
    this.earthOrbit.add(earthMesh);
    this.solarSystem.add(this.earthOrbit);
    this.objects.push(this.earthOrbit);
    super.makeAxisGrid(this.earthOrbit, "earthOrbit");
    super.makeAxisGrid(earthMesh, "sunMesh");
  }

  // 创建月亮
  createMoon() {
    const moonMaterial = new THREE.MeshPhongMaterial({
      color: 0x888888,
      emissive: 0x222222,
    });
    const moonMesh = new THREE.Mesh(this.createSphere(), moonMaterial);
    moonMesh.scale.set(0.5, 0.5, 0.5);
    this.moonOrbit.add(moonMesh);
    this.earthOrbit.add(this.moonOrbit);
    this.objects.push(this.moonOrbit);
    super.makeAxisGrid(this.moonOrbit, "earthOrbit");
    super.makeAxisGrid(moonMesh, "sunMesh");
  }

  // 组织星球
  orgPlanet() {
    this.createSun(); // 太阳
    this.createEarth(); // 地球
    this.createMoon(); // 月亮
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

      this.canvas.render(this.scene, this.camera);
      requestAnimationFrame(animationContent);
    };
    animationContent();
  }
}
