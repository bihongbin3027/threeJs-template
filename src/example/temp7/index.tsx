/*
 * @Description 加载模型
 * @Author bihongbin
 * @Date 2021-09-23 10:10:46
 * @LastEditors bihongbin
 * @LastEditTime 2021-09-23 16:45:38
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import BaseClass from '@/baseClass';

const checker = require('@/assets/images/checker.png');
const lamborghini = require('@/assets/model/lamborghini/Lamborghini.obj');
const lamborghiniMtl = require('@/assets/model/lamborghini/Lamborghini.mtl');

export default class ThreeTemplate7 extends BaseClass {
  // 场景
  scene: THREE.Scene;
  // 渲染器
  canvas: THREE.WebGLRenderer;
  // 透视摄像机
  camera: THREE.PerspectiveCamera;
  // 轨道控制器
  orbitControls: OrbitControls;

  // TextureLoader
  textureLoader = new THREE.TextureLoader();
  // OBJLoader
  objLoader = new OBJLoader();
  // MtlLoader
  mtlLoader = new MTLLoader();
  // 地面大小
  planeSize = 40;

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
    // 创建内容
    this.createBody();
  }

  // 场景
  createScene() {
    const scene = new THREE.Scene();
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
    camera.position.set(0, 10, 20);
    // 透视摄像机自适应
    super.resizePerspectiveCameraDisplaySize(this.canvas, camera);
    return camera;
  }

  // 轨道控制器
  createOrbitControls() {
    const controls = new OrbitControls(this.camera, this.canvas.domElement);
    controls.addEventListener('change', this.render.bind(this));
    return controls;
  }

  // 内容
  createBody() {
    // 创建光
    this.createLight();
    // 创建地面
    this.createGround();
    // 加载模型
    this.createModel();
  }

  // 光
  createLight() {
    // 平行光
    const color = 0xffffff;
    const intensity = 0.75;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 5);
    this.scene.add(light);
  }

  // 地面
  createGround() {
    // 地面贴图
    this.textureLoader.load(checker, (texture) => {
      const repeats = this.planeSize / 2;
      // 贴图水平方向包裹方式
      texture.wrapS = THREE.RepeatWrapping;
      // 贴图垂直方向包裹方式
      texture.wrapT = THREE.RepeatWrapping;
      // 使用最接近的贴图的值
      texture.magFilter = THREE.NearestFilter;
      // x,y方向重复多少次
      texture.repeat.set(repeats, repeats);

      // 平面体
      const planeGeo = new THREE.PlaneGeometry(this.planeSize, this.planeSize);
      // 材质
      const planeMat = new THREE.MeshBasicMaterial({
        map: texture,
        // 双面纹理
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(planeGeo, planeMat);
      mesh.rotation.x = Math.PI * -0.5;
      this.scene.add(mesh);
      this.render();
    });
  }

  // 兰博基尼模型
  createModel() {
    this.mtlLoader.load(lamborghiniMtl, (mtl) => {
      mtl.preload();
      this.objLoader.setMaterials(mtl);
      this.objLoader.load(lamborghini, (group) => {
        group.rotation.x = Math.PI * -0.5;
        group.scale.set(0.05, 0.05, 0.05);
        this.scene.add(group);
        this.render();
      });
    });
  }

  // 渲染
  render() {
    this.canvas.render(this.scene, this.camera);
  }
}
