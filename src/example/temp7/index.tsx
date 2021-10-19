/*
 * @Description 加载模型
 * @Author bihongbin
 * @Date 2021-09-23 10:10:46
 * @LastEditors bihongbin
 * @LastEditTime 2021-10-13 10:58:30
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import BaseClass from '@/baseClass';

// const checker = require('@/assets/images/checker.png');
const volkswagenMtl = require('@/assets/model/volkswagen/car.mtl');
const volkswagen = require('@/assets/model/volkswagen/car.obj');

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
  planeSize = 200;

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
    const canvas = new THREE.WebGLRenderer({
      // 消除锯齿
      antialias: true,
    });
    canvas.setClearColor(0x666666);
    document.body.appendChild(canvas.domElement);
    return canvas;
  }

  // 透视摄像机
  createPerspectiveCamera() {
    const fov = 45;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 100);
    // 透视摄像机自适应
    super.resizePerspectiveCameraDisplaySize(this.canvas, camera, this.scene);
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
    // 环境光
    const ambient = new THREE.AmbientLight(0x666666, 0.75);
    this.scene.add(ambient);

    // 平行光
    const directional = new THREE.DirectionalLight(0x989898, 0.75);
    directional.position.set(0, 30, 0);
    this.scene.add(directional);
  }

  // 地面
  createGround() {
    // 地面贴图
    // this.textureLoader.load(checker, (texture) => {
    //   const repeats = this.planeSize / 2;
    //   // 贴图水平方向包裹方式
    //   texture.wrapS = THREE.RepeatWrapping;
    //   // 贴图垂直方向包裹方式
    //   texture.wrapT = THREE.RepeatWrapping;
    //   // 使用最接近的贴图的值
    //   texture.magFilter = THREE.NearestFilter;
    //   // x,y方向重复多少次
    //   texture.repeat.set(repeats, repeats);

    //   // 平面体
    //   const planeGeo = new THREE.PlaneGeometry(this.planeSize, this.planeSize);
    //   // 材质
    //   const planeMat = new THREE.MeshBasicMaterial({
    //     map: texture,
    //     // 双面材质
    //     side: THREE.DoubleSide,
    //   });
    //   const mesh = new THREE.Mesh(planeGeo, planeMat);
    //   mesh.rotation.x = Math.PI * -0.5;
    //   this.scene.add(mesh);
    //   this.render();
    // });

    // 网格辅助对象
    const grid = new THREE.GridHelper(this.planeSize, 40);
    grid.material.opacity = 0.5;
    grid.material.transparent = true;
    this.scene.add(grid);

    // 地面
    const planeGeometry = new THREE.PlaneGeometry(
      this.planeSize,
      this.planeSize,
    );
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI * -0.5;
    this.scene.add(plane);
  }

  // 大众汽车模型
  createModel() {
    // 材质
    this.mtlLoader.load(volkswagenMtl, (mtl) => {
      mtl.preload();
      this.objLoader.setMaterials(mtl);
      // 模型
      this.objLoader.load(volkswagen, (group) => {
        console.log('group', group);
        group.scale.set(0.01, 0.01, 0.01);
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
