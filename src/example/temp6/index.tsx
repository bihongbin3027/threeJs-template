/*
 * @Description 阴影
 * @Author bihongbin
 * @Date 2021-09-14 11:09:18
 * @LastEditors bihongbin
 * @LastEditTime 2021-09-16 16:41:51
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

  // TextureLoader
  textureLoader = new THREE.TextureLoader();
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
    // controls.addEventListener('change', this.render.bind(this));
    return controls;
  }

  // 光
  createLight() {
    // 半球光
    {
      const skyColor = 0xb1e1ff;
      const groundColor = 0xb97a20;
      const intensity = 0.25;
      const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
      this.scene.add(light);
    }
    // 平行光
    {
      const color = 0xffffff;
      const intensity = 0.75;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(0, 10, 5);
      light.target.position.set(-5, 0, 0);
      this.scene.add(light);
      this.scene.add(light.target);
    }
  }

  // 地面
  createGround() {
    // 地面贴图
    this.textureLoader.load(checker, (texture) => {
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
    });
  }

  // 阴影球体
  createShadowSphere() {
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
    this.textureLoader.load(roundShadow, (texture) => {
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
    });
  }

  // 内容
  createBody() {
    // 创建光
    this.createLight();
    // 创建地面
    this.createGround();
    // 创建阴影球体
    this.createShadowSphere();
  }

  render() {
    const content = (time: number) => {
      // 转换为秒
      time *= 0.001;

      this.sphereShadowBases.forEach((sphereShadowBase, ndx) => {
        const { base, sphereMesh, shadowMesh, y } = sphereShadowBase;
        const u = ndx / this.sphereShadowBases.length;

        const speed = time * 0.2;
        const angle = speed + u * Math.PI * 2 * (ndx % 1 ? 1 : -1);
        const radius = Math.sin(speed - ndx) * 10;
        const yOff = Math.abs(Math.sin(time * 2 + ndx));
        base.position.set(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius,
        );

        sphereMesh.position.y = y + THREE.MathUtils.lerp(-2, 2, yOff);
        // @ts-ignore
        shadowMesh.material.opacity = THREE.MathUtils.lerp(1, 0.25, yOff);
      });

      this.canvas.render(this.scene, this.camera);
      requestAnimationFrame(content);
    };
    requestAnimationFrame(content);
  }
}
