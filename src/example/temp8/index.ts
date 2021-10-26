/*
 * @Description 创建小车
 * @Author bihongbin
 * @Date 2021-10-20 09:32:37
 * @LastEditors bihongbin
 * @LastEditTime 2021-10-26 17:32:14
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import BaseClass from "@/baseClass";

export default class ThreeTemplate8 extends BaseClass {
  // 场景
  scene: THREE.Scene;
  // 渲染器
  rootCanvas: THREE.WebGLRenderer;
  // 透视摄像机
  camera: THREE.PerspectiveCamera;
  // 轨道控制器
  orbitControls: OrbitControls;

  // 地面大小
  planeSize = 30;

  constructor(data: { el: string }) {
    super();

    // 创建场景
    this.scene = this.createScene();
    // 创建渲染器
    this.rootCanvas = this.createBodyContainer(data.el);
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

    // 模拟3个坐标轴
    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    // 平行光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    scene.add(directionalLight);

    return scene;
  }

  // 渲染器
  createBodyContainer(el: string) {
    const bodyContainer = new THREE.WebGLRenderer({
      // 消除锯齿
      antialias: true,
    });
    document.getElementById(el).appendChild(bodyContainer.domElement);
    return bodyContainer;
  }

  // 透视摄像机
  createPerspectiveCamera() {
    const fov = 45;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(10, 5, 5);
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
    controls.addEventListener("change", this.render.bind(this));
    return controls;
  }

  // 内容
  createBody() {
    // 创建地面
    this.createGround();
    // 创建汽车
    this.createCar();
  }

  // 地面
  createGround() {
    // 网格辅助对象
    const gridHelp = new THREE.GridHelper(
      this.planeSize,
      this.planeSize,
      0x000000
    );
    this.scene.add(gridHelp);

    // 地面
    const planeGeometry = new THREE.PlaneGeometry(
      this.planeSize,
      this.planeSize
    );
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const planeCube = new THREE.Mesh(planeGeometry, planeMaterial);
    planeCube.rotation.x = Math.PI * -0.5;
    this.scene.add(planeCube);
  }

  // 汽车
  createCar() {
    // 车宽
    const carWidth = 3;
    // 车高
    const carHeight = 2;
    // 车长
    const carLength = 6;
    const carObject = new THREE.Group();
    carObject.name = "car";

    // 车身
    const carBody = () => {
      const upperGroup = new THREE.Group();
      upperGroup.name = "body";

      {
        // 前后
        const getCarBeforeAndAfterTexture = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = 64;
          canvas.height = 32;

          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);

          context.fillStyle = "#666666";
          context.fillRect(8, 8, 48, 24);

          return new THREE.CanvasTexture(canvas);
        };
        // 左右
        const getCarSideTexture = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = 128;
          canvas.height = 32;

          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);

          context.fillStyle = "#666666";
          context.fillRect(10, 8, 38, 24);
          context.fillRect(58, 8, 60, 24);

          return new THREE.CanvasTexture(canvas);
        };

        const carBeforeAndAfterTexture = getCarBeforeAndAfterTexture();
        const carSideTexture = getCarSideTexture();

        const geometry = new THREE.BoxBufferGeometry(
          carWidth / 1.5,
          carHeight * (2.3 / 5),
          carLength / 2
        );
        const mesh = new THREE.Mesh(geometry, [
          // 左
          new THREE.MeshLambertMaterial({ map: carSideTexture }),
          // 右
          new THREE.MeshLambertMaterial({ map: carSideTexture }),
          // 上
          new THREE.MeshLambertMaterial({ color: 0xffffff }),
          // 下
          new THREE.MeshLambertMaterial({ color: 0xffffff }),
          // 前
          new THREE.MeshLambertMaterial({ map: carBeforeAndAfterTexture }),
          // 后
          new THREE.MeshLambertMaterial({ map: carBeforeAndAfterTexture }),
        ]);
        mesh.position.y = carHeight / 2;
        mesh.position.z = -carLength / 15;
        upperGroup.add(mesh);
      }

      {
        const geometry = new THREE.BoxGeometry(
          carWidth,
          carHeight * (2.7 / 5),
          carLength
        );
        const material = new THREE.MeshLambertMaterial({ color: 0xcd2e2b });
        const mesh = new THREE.Mesh(geometry, material);
        upperGroup.add(mesh);
      }

      return upperGroup;
    };

    // 轮胎
    const carTire = () => {
      // 圆环半径
      const radius = 0.4;
      // 管道半径
      const tube = radius / 2;
      // 圆环分段数
      const radialSegments = 8;
      // 管道分段数
      const tubularSegments = 100;

      // 用来存放4个轮胎
      const wheelGroup = new THREE.Group();
      wheelGroup.name = "wheel";

      const geometry = new THREE.TorusGeometry(
        radius,
        tube,
        radialSegments,
        tubularSegments
      );
      const material = new THREE.MeshLambertMaterial({ color: 0x333333 });

      // 4个轮胎位置
      const wheelPositions = [
        [-carWidth / 2, -carHeight / 2 + radius, carLength / 3],
        [carWidth / 2, -carHeight / 2 + radius, carLength / 3],
        [-carWidth / 2, -carHeight / 2 + radius, -carLength / 3],
        [carWidth / 2, -carHeight / 2 + radius, -carLength / 3],
      ];
      wheelPositions.map((position) => {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position[0], position[1], position[2]);
        mesh.rotation.y = Math.PI * -0.5;
        wheelGroup.add(mesh);
        return mesh;
      });

      // 调整汽车y位置刚好到地面
      carObject.position.y = carHeight / 2 + tube;
      return wheelGroup;
    };

    // 添加车身
    carObject.add(carBody());
    // 添加轮胎
    carObject.add(carTire());

    this.scene.add(carObject);
  }

  // 渲染内容
  render() {
    this.rootCanvas.render(this.scene, this.camera);
  }
}
