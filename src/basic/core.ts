import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface LightClumpType {
  // 半球光
  hemiLight: THREE.HemisphereLight;
  // 方向光
  dirLight: THREE.DirectionalLight;
}

class Core {
  // 场景
  scene: THREE.Scene;
  // 渲染器
  rootCanvas: THREE.WebGLRenderer;
  // 透视摄像机
  camera: THREE.PerspectiveCamera;
  // 轨道控制器
  orbitControls: OrbitControls;
  // 光
  light: LightClumpType = { hemiLight: undefined, dirLight: undefined };
  // 天空
  sky: THREE.Mesh;
  // 地面
  ground: THREE.Mesh;

  // 场景
  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color().setHSL(0.6, 0, 1);
    this.scene.fog = new THREE.Fog(this.scene.background, 1, 5000);

    const alesHelper = new THREE.AxesHelper(10);
    this.scene.add(alesHelper);

    return this.scene;
  }

  // 渲染器
  createRootCanvas(el: string) {
    this.rootCanvas = new THREE.WebGLRenderer({
      // 消除锯齿
      antialias: true,
    });
    // 修改输出编码
    this.rootCanvas.outputEncoding = THREE.sRGBEncoding;
    // 启用阴影
    this.rootCanvas.shadowMap.enabled = true;
    if (el) {
      document.getElementById(el).appendChild(this.rootCanvas.domElement);
    } else {
      document.body.appendChild(this.rootCanvas.domElement);
    }

    return this.rootCanvas;
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
    const far = 5000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(35, 30, 0);

    // 透视摄像机自适应
    this.resizePerspectiveCameraDisplaySize(
      this.rootCanvas,
      this.camera,
      this.scene
    );

    return this.camera;
  }

  // 光源
  createLight() {
    // 半球光
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);

    // 方向光
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(30);
    dirLight.castShadow = true;

    this.scene.add(dirLight);
    this.light.hemiLight = hemiLight;
    this.light.dirLight = dirLight;

    return this.light;
  }

  // 轨道控制器
  createOrbitControls() {
    this.orbitControls = new OrbitControls(
      this.camera,
      this.rootCanvas.domElement
    );
    return this.orbitControls;
  }

  // 天空
  createSky() {
    const vertexShader = `
      varying vec3 vWorldPosition;

      void main() {

        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        vWorldPosition = worldPosition.xyz;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }
    `;
    const fragmentShader = `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;

      varying vec3 vWorldPosition;

      void main() {

        float h = normalize( vWorldPosition + offset ).y;
        gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );

      }
    `;
    const uniforms = {
      topColor: { value: new THREE.Color(0x0077ff) },
      bottomColor: { value: new THREE.Color(0xffffff) },
      offset: { value: 33 },
      exponent: { value: 0.6 },
    };

    uniforms["topColor"].value.copy(this.light.hemiLight.color);
    this.scene.fog.color.copy(uniforms["bottomColor"].value);

    const skyGeo = new THREE.SphereGeometry(500, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.BackSide,
    });
    const mesh = new THREE.Mesh(skyGeo, skyMat);
    mesh.name = "sky";

    this.sky = mesh;
    this.scene.add(mesh);

    return mesh;
  }

  // 地面
  async createGround() {
    const planeSize = 10000;
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
    mesh.name = "ground";
    // 渲染顺序（小的先渲染，大的后渲染）
    mesh.renderOrder = 1;
    mesh.rotation.x = Math.PI * -0.5;
    // 可以接收阴影
    mesh.receiveShadow = true;

    this.ground = mesh;
    this.scene.add(mesh);

    return mesh;
  }

  // 核心视图
  async warpSpeed(data?: { el: string }) {
    // 创建场景
    const scene = this.createScene();
    // 创建渲染器
    const rootCanvas = this.createRootCanvas(data && data.el);
    // 创建透视摄像机
    const camera = this.createPerspectiveCamera();
    // 创建光源
    const light = this.createLight();
    // 创建轨道控制器
    const orbitControls = this.createOrbitControls();
    // 天空
    const sky = this.createSky();
    // 地面
    const ground = await this.createGround();

    return {
      scene,
      rootCanvas,
      camera,
      light,
      orbitControls,
      sky,
      ground,
    };
  }
}

export default Core;
