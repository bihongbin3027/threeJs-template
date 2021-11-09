/*
 * @Description 建筑
 * @Author bihongbin
 * @Date 2021-11-02 16:10:03
 * @LastEditors bihongbin
 * @LastEditTime 2021-11-09 17:24:41
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import BaseClass from "@/baseClass";

export default class ThreeTemplate9 extends BaseClass {
  // 场景
  scene: THREE.Scene;
  // 渲染器
  rootCanvas: THREE.WebGLRenderer;
  // 透视摄像机
  camera: THREE.PerspectiveCamera;
  // 轨道控制器
  orbitControls: OrbitControls;

  // 地面大小
  planeSize = 100;

  constructor(data: { el: string }) {
    super();

    // 创建场景
    this.scene = this.createScene();
    // 创建渲染器
    this.rootCanvas = this.createRootCanvas(data.el);
    // 创建透视摄像机
    this.camera = this.createPerspectiveCamera();
    // 创建轨道控制器
    this.orbitControls = this.createOrbitControls();
    // 创建内容
    this.createContent();
  }

  // 场景
  createScene() {
    const scene = new THREE.Scene();

    const alesHelper = new THREE.AxesHelper(10);
    scene.add(alesHelper);

    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // 平行光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 10, 0);
    scene.add(directionalLight);

    return scene;
  }

  // 渲染器
  createRootCanvas(el: string) {
    const rootCanvas = new THREE.WebGLRenderer({
      // 消除锯齿
      antialias: true,
    });
    document.getElementById(el).appendChild(rootCanvas.domElement);
    return rootCanvas;
  }

  // 透视摄像机
  createPerspectiveCamera() {
    const fov = 45;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 1;
    const far = 10000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 150, 0);
    // 透视摄像机自适应
    super.resizePerspectiveCameraDisplaySize(
      this.rootCanvas,
      camera,
      this.scene
    );
    return camera;
  }

  // 创建轨道控制器
  createOrbitControls() {
    const controls = new OrbitControls(this.camera, this.rootCanvas.domElement);
    return controls;
  }

  // 内容
  createContent() {
    // 创建地面
    this.createGround();
    // 创建建筑
    this.createBuilding();
    // 创建马路
    this.createRoad();
  }

  // 创建obj模型
  async createObjLoader(param: {
    mtlPath: string;
    objPath: string;
    action: (data: THREE.Group) => void;
  }) {
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();

    const mtl = await mtlLoader.loadAsync(param.mtlPath);
    objLoader.setMaterials(mtl);
    const group = await objLoader.loadAsync(param.objPath);
    param.action(group);

    this.scene.add(group);
  }

  // 地面
  createGround() {
    const meadowJpg = require("@/assets/images/meadow.jpg");
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(meadowJpg, (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(this.planeSize, this.planeSize);

      const geometry = new THREE.PlaneBufferGeometry(
        this.planeSize,
        this.planeSize
      );
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        // 双面材质
        side: THREE.DoubleSide,
      });
      // 开启多边形偏移
      material.polygonOffset = true;
      // 摄像机距离 正值-远离相机 负值-靠近相机
      material.polygonOffsetFactor = 1;
      const mesh = new THREE.Mesh(geometry, material);
      // 渲染顺序（小的先渲染，大的后渲染）
      mesh.renderOrder = 1;
      mesh.rotation.x = Math.PI * -0.5;

      this.scene.add(mesh);
    });
  }

  // 建筑
  createBuilding() {
    this.createObjLoader({
      mtlPath: "/static/model/building/houseA_obj.mtl",
      objPath: "/static/model/building/houseA_obj.obj",
      action: (data) => {
        data.scale.set(0.1, 0.1, 0.1);
      },
    });
  }

  // 马路
  createRoad() {
    const roadObj = new THREE.Group();
    const outerRing = this.planeSize / 3;
    const width = 4;
    const height = this.planeSize - outerRing * 2;
    const color = 0x4b5161;

    const roundGeometry = new THREE.CircleGeometry(width / 2, 30, 0, Math.PI);
    const roundMaterial = new THREE.MeshBasicMaterial({ color });
    const roundLeftMesh = new THREE.Mesh(roundGeometry, roundMaterial);
    const roundRightMesh = roundLeftMesh.clone();

    const planeGeometry = new THREE.PlaneGeometry(width, height);
    const planeMaterial = new THREE.MeshBasicMaterial({ color });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

    // x,y,z
    const roadPositions = [
      [this.planeSize / -2 + outerRing, 0, 0],
      [0, 0, this.planeSize / -2 + outerRing],
      [this.planeSize / 2 - outerRing, 0, 0],
      [0, 0, this.planeSize / 2 - outerRing],
    ];

    roundLeftMesh.position.y = height / 2;
    roundRightMesh.position.y = (height / 2) * -1;
    roundRightMesh.rotation.z = Math.PI;

    // 渲染顺序（小的先渲染，大的后渲染）
    roadObj.renderOrder = 2;
    roadObj.rotation.x = Math.PI * -0.5;

    roadObj.add(roundLeftMesh);
    roadObj.add(roundRightMesh);
    roadObj.add(planeMesh);

    for (let [index, item] of roadPositions.entries()) {
      const clone = roadObj.clone();

      if (index % 2 !== 0) {
        clone.rotation.z = Math.PI * 0.5;
      }

      clone.position.set(item[0], item[1], item[2]);
      this.scene.add(clone);
    }
  }

  // 渲染内容
  render() {
    const animation = (time: number) => {
      console.log("requestAnimationFrame", time);

      this.rootCanvas.render(this.scene, this.camera);
      requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  }
}
