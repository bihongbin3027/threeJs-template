/*
 * @Description 光源
 * @Author bihongbin
 * @Date 2021-08-18 15:44:03
 * @LastEditors bihongbin
 * @LastEditTime 2021-09-02 15:57:47
 */
import * as THREE from 'three';
import { OrbitControls } from '@three-ts/orbit-controls';
import { GUI } from 'dat.gui';
import BaseClass from '@/baseClass';
import checker from '@/images/checker.png';

class ColorGUIHelper {
  object: any;
  prop: string;

  constructor(object: ColorGUIHelper['object'], prop: ColorGUIHelper['prop']) {
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
    scene.add(new THREE.AxesHelper(10));
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

  // 轨道控制器
  createOrbitControls() {
    const controls = new OrbitControls(this.camera, this.canvas.domElement);
    controls.autoRotate = true;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.addEventListener('change', this.render.bind(this));
    return controls;
  }

  // 光
  createLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    this.scene.add(light);
    this.scene.add(light.target);

    // GUI助手参数控制
    {
      const gui = new GUI();
      const colorController = gui
        .addColor(new ColorGUIHelper(light, 'color'), 'value')
        .name('color');
      const intensityController = gui.add(light, 'intensity', 0, 2, 0.01);
      const xController = gui.add(light.target.position, 'x', -10, 10);
      const yController = gui.add(light.target.position, 'z', -10, 10);
      const zController = gui.add(light.target.position, 'y', 0, 10);
      colorController.onChange(() => {
        this.render();
      });
      intensityController.onChange(() => {
        this.render();
      });
      xController.onChange(() => {
        this.render();
      });
      yController.onChange(() => {
        this.render();
      });
      zController.onChange(() => {
        this.render();
      });
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
