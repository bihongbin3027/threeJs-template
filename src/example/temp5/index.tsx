/*
 * @Description 光源
 * @Author bihongbin
 * @Date 2021-08-18 15:44:03
 * @LastEditors bihongbin
 * @LastEditTime 2021-08-27 17:45:15
 */
import * as THREE from 'three';
import { OrbitControls } from '@three-ts/orbit-controls';
import BaseClass from '@/baseClass';
import checker from '@/images/checker.png';

export default class ThreeTemplate5 extends BaseClass {
  // 场景
  scene: THREE.Scene;
  // 渲染器
  canvas: THREE.WebGLRenderer;
  // 摄像机
  camera: THREE.PerspectiveCamera;
  // 轨道控制器
  orbitControls: OrbitControls;
  // 光
  light: THREE.AmbientLight;

  // 地面大小
  planeSize = 40;

  constructor() {
    super();

    // 创建场景
    this.scene = this.createScene();
    // 创建渲染器
    this.canvas = this.createCanvas();
    // 创建透视摄像机
    this.camera = this.createCamera();
    // 创建轨道控制器
    this.orbitControls = this.createOrbitControls();
    // 创建光
    this.light = this.createLight();

    // 创建内容
    this.createBody();
  }

  // 场景
  createScene() {
    const scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(5));
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

  // 光
  createLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.AmbientLight(color, intensity);
    this.scene.add(light);
    return light;
  }

  // 轨道控制器
  createOrbitControls() {
    const controls = new OrbitControls(this.camera, this.canvas.domElement);
    controls.autoRotate = true;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.addEventListener('change', this.render.bind(this));
    return controls;
  }

  // 创建地面
  createGround() {
    const loader = new THREE.TextureLoader();
    loader.load(checker, (texture) => {
      const repeats = this.planeSize / 2;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.magFilter = THREE.NearestFilter;
      texture.repeat.set(repeats, repeats);
      // 平面体
      {
        const planeGeo = new THREE.PlaneGeometry(
          this.planeSize,
          this.planeSize,
        );
        const planeMat = new THREE.MeshPhongMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });

        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * -0.5;
        this.scene.add(mesh);
      }
      this.render();
    });
  }

  // 内容
  createBody() {
    // 创建地面
    this.createGround();
    // 正方体
    {
      const cubeSize = 4;
      const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMat = new THREE.MeshPhongMaterial({ color: '#8ac' });
      const mesh = new THREE.Mesh(cubeGeo, cubeMat);
      mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
      this.scene.add(mesh);
    }
    // 球
    {
      const sphereRadius = 3;
      const sphereWidthDivisions = 32;
      const sphereHeightDivisions = 16;
      const sphereGeo = new THREE.SphereBufferGeometry(
        sphereRadius,
        sphereWidthDivisions,
        sphereHeightDivisions,
      );
      const sphereMat = new THREE.MeshPhongMaterial({ color: '#ca8' });
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
      this.scene.add(mesh);
    }
  }

  render() {
    this.canvas.render(this.scene, this.camera);
  }
}
