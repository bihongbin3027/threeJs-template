/*
 * @Description 阴影
 * @Author bihongbin
 * @Date 2021-09-14 11:09:18
 * @LastEditors bihongbin
 * @LastEditTime 2021-09-15 18:16:32
 */
import * as THREE from 'three';
import { OrbitControls } from '@three-ts/orbit-controls';
import BaseClass from '@/baseClass';
import checker from '@/images/checker.png';
import roundShadow from '@/images/roundshadow.png';

export default class ThreeTemplate6 extends BaseClass {
  // 场景
  scene: THREE.Scene;
  // 渲染器
  canvas: THREE.WebGLRenderer;
  // 透视摄像机
  camera: THREE.PerspectiveCamera;
  // 轨道控制器
  orbitControls: OrbitControls;

  // 地面大小
  planeSize = 40;
  // 所有球体
  sphereShadowBases: {
    base: THREE.Object3D;
    sphereMesh: THREE.Mesh;
    shadowMesh: THREE.Mesh;
    y: THREE.Vector3['y'];
  }[] = [];

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
    scene.background = new THREE.Color('white');
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
    controls.addEventListener('change', this.render.bind(this));
    return controls;
  }

  // 地面
  createGround() {
    const loader = new THREE.TextureLoader();
    // 地面贴图
    loader.load(checker, (texture) => {
      const repeats = this.planeSize / 2;
      // 纹理水平方向包裹方式
      texture.wrapS = THREE.RepeatWrapping;
      // 纹理垂直方向包裹方式
      texture.wrapT = THREE.RepeatWrapping;
      // 使用最接近的纹素的值
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
      // 将纹理材质颜色倍增1.5,1.5,1.5
      planeMat.color.setRGB(1.5, 1.5, 1.5);
      const mesh = new THREE.Mesh(planeGeo, planeMat);
      mesh.rotation.x = Math.PI * -0.5;
      this.scene.add(mesh);

      // 这段代码添加了动画后删掉
      this.render();
    });
  }

  // 阴影球体
  createShadowSphere() {
    const loader = new THREE.TextureLoader();
    const sphereRadius = 1;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    // 球体
    const sphereGeo = new THREE.SphereGeometry(
      sphereRadius,
      sphereWidthDivisions,
      sphereHeightDivisions,
    );
    // 水平面(放阴影)
    const shadowGeo = new THREE.PlaneGeometry(1, 1);
    // 阴影贴图
    loader.load(roundShadow, (texture) => {
      const numSpheres = 15;
      for (let i = 0; i < numSpheres; i++) {
        const base = new THREE.Object3D();
        this.scene.add(base);

        // 创建阴影
        const shadowMat = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          depthWrite: true,
        });
        const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
        shadowMesh.position.y = 0.001;
        shadowMesh.rotation.x = Math.PI * -0.5;
        const shadowSize = sphereRadius * 4;
        shadowMesh.scale.set(shadowSize, shadowSize, shadowSize);
        base.add(shadowMesh);

        // 创建球体
        const u = i / numSpheres;
        const sphereMat = new THREE.MeshPhongMaterial();
        sphereMat.color.setHSL(u, 1, 0.75);
        const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
        sphereMesh.position.set(0, sphereRadius + 2, 0);
        base.add(sphereMesh);

        this.sphereShadowBases.push({
          base,
          sphereMesh,
          shadowMesh,
          y: sphereMesh.position.y,
        });
      }

      // 这段代码添加了动画后删掉
      this.render();
    });
  }

  // 内容
  createBody() {
    // 创建地面
    this.createGround();
    // 创建阴影球体
    this.createShadowSphere();
  }

  render() {
    this.canvas.render(this.scene, this.camera);
  }
}
