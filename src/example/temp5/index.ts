/*
 * @Description 光源
 * @Author bihongbin
 * @Date 2021-08-18 15:44:03
 * @LastEditors bihongbin
 * @LastEditTime 2021-11-04 15:17:51
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";
import BaseClass from "@/baseClass";
import checker from "@/assets/images/checker.png";

class ColorGUIHelper {
  object: any;
  prop: string;

  constructor(object: ColorGUIHelper["object"], prop: ColorGUIHelper["prop"]) {
    this.object = object;
    this.prop = prop;
  }

  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }

  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

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
  light: THREE.DirectionalLight;

  // 地面大小
  planeSize = 40;

  constructor(data: { el: string }) {
    super();

    // 创建场景
    this.scene = this.createScene();
    // 创建渲染器
    this.canvas = this.createCanvas(data.el);
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
    scene.add(new THREE.AxesHelper(10));
    return scene;
  }

  // 渲染器
  createCanvas(el: string) {
    const canvas = new THREE.WebGLRenderer();
    canvas.setClearColor(0xaaaaaa);
    document.getElementById(el).appendChild(canvas.domElement);
    return canvas;
  }

  // 透视摄像机
  createCamera(fov = 45) {
    // canvas 的默认宽高 300:150
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 30);
    // 透视摄像机自适应渲染
    super.resizePerspectiveCameraDisplaySize(this.canvas, camera);
    return camera;
  }

  // 轨道控制器
  createOrbitControls() {
    const controls = new OrbitControls(this.camera, this.canvas.domElement);
    controls.autoRotate = true;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.addEventListener("change", this.render.bind(this));
    return controls;
  }

  // 光
  createLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    const helper = new THREE.DirectionalLightHelper(light);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    this.scene.add(light);
    this.scene.add(light.target);
    this.scene.add(helper);

    // GUI相关
    {
      const makeXYZGUI = (
        gui: GUI,
        vector3: THREE.Vector3,
        name: keyof THREE.DirectionalLight,
        onChangeFn: (value?: any) => void
      ) => {
        const folder = gui.addFolder(name);
        folder.add(vector3, "x", -10, 10).onChange(onChangeFn);
        folder.add(vector3, "y", 0, 10).onChange(onChangeFn);
        folder.add(vector3, "z", -10, 10).onChange(onChangeFn);
        folder.open();
      };
      const updateLight = () => {
        light.target.updateMatrixWorld();
        helper.update();
        this.render();
      };

      const gui = new GUI();
      gui
        .addColor(new ColorGUIHelper(light, "color"), "value")
        .onChange(updateLight)
        .name("color");
      gui.add(light, "intensity", 0, 2, 0.01).onChange(updateLight);
      makeXYZGUI(gui, light.position, "position", updateLight);
      makeXYZGUI(gui, light.target.position, "target", updateLight);

      updateLight();
    }
    return light;
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
          this.planeSize
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
      const cubeMat = new THREE.MeshPhongMaterial({ color: "#8ac" });
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
        sphereHeightDivisions
      );
      const sphereMat = new THREE.MeshPhongMaterial({ color: "#ca8" });
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
      this.scene.add(mesh);
    }
  }

  // 渲染内容
  render() {
    this.canvas.render(this.scene, this.camera);
  }
}
