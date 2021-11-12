import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class Core {
  // 场景
  scene: THREE.Scene;
  // 渲染器
  rootCanvas: THREE.WebGLRenderer;
  // 透视摄像机
  camera: THREE.PerspectiveCamera;
  // 轨道控制器
  orbitControls: OrbitControls;

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

  // 透视摄像机 PerspectiveCamera 自适应渲染
  resizePerspectiveCameraDisplaySize(
    renderer: THREE.WebGLRenderer,
    camera?: THREE.PerspectiveCamera,
    scene?: THREE.Scene
  ) {
    const resize = () => {
      const canvas = renderer.domElement;
      // 分辨率倍数
      const pixelRatio = window.devicePixelRatio;
      const clientWidth = canvas.clientWidth;
      const clientHeight = canvas.clientHeight;
      const width = (clientWidth * pixelRatio) | 0;
      const height = (clientHeight * pixelRatio) | 0;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
        if (camera) {
          camera.aspect = clientWidth / clientHeight;
          camera.updateProjectionMatrix();
          if (scene) {
            renderer.render(scene, camera);
          }
        }
      }
    };
    resize();
    window.addEventListener("resize", resize);
  }

  // 透视摄像机
  createPerspectiveCamera() {
    const fov = 45;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(35, 30, 0);

    // 透视摄像机自适应
    this.resizePerspectiveCameraDisplaySize(
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

  // 地面
  async createGround() {
    const planeSize = 100;
    const meadowJpg = require("@/assets/images/meadow.jpg");
    const textureLoader = new THREE.TextureLoader();
    const texture = await textureLoader.loadAsync(meadowJpg);

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(planeSize, planeSize);

    const geometry = new THREE.PlaneBufferGeometry(planeSize, planeSize);
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

    return mesh;
  }

  async wrapSpeed(data: { el: string }) {
    // 创建场景
    this.scene = this.createScene();
    // 创建渲染器
    this.rootCanvas = this.createRootCanvas(data.el);
    // 创建透视摄像机
    this.camera = this.createPerspectiveCamera();
    // 创建轨道控制器
    this.orbitControls = this.createOrbitControls();

    return {
      scene: this.scene,
      rootCanvas: this.rootCanvas,
      camera: this.camera,
      orbitControls: this.orbitControls,
      ground: await this.createGround(),
    };
  }
}

export default Core;
