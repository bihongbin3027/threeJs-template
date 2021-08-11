import * as THREE from 'three';
import BaseClass from './baseClass'
import '@/style/global.css';

// 多个立方体旋转
class threeTemplate1 extends BaseClass {
  // 渲染器
  webGl: THREE.WebGLRenderer;
  // 透视摄像机
  camera: THREE.PerspectiveCamera;
  // 场景
  scene: THREE.Scene;
  // 灯光
  light: THREE.DirectionalLight;

  constructor() {
    super()
    this.scene = new THREE.Scene(); // 场景
    this.webGl = this.createRender(); // 渲染器
    this.camera = this.setCamera(); // 配置摄像机
    this.light = this.addLight(); // 添加灯光
  }

  // 渲染器
  createRender() {
    const renderer = new THREE.WebGLRenderer();
    // renderer.setSize(window.innerWidth, window.innerHeight); // 设置尺寸
    document.body.appendChild(renderer.domElement);
    return renderer;
  }

  // 配置摄像机
  setCamera() {
    const fov = 75; // 视野范围 垂直方向75度
    const aspect = 2; // 画布宽高比 默认300x150 所以宽高比为300/150=2
    const near = 0.1,
      far = 5; // 近平面、远平面 限制了摄像机面朝方向的可绘区域，任何距离小于或超过这个范围的物体都将被裁剪掉(不绘制)
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 4;
    return camera;
  }

  // 添加灯光
  addLight() {
    const color = 0xffffff;
    const intensity = 1; // 强度
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this.scene.add(light);
    return light;
  }

  // 生成实例
  makeInstance(geometry: THREE.BoxGeometry, color: number, x: number) {
    // 材质
    const material = new THREE.MeshPhongMaterial({ color });
    // 网格
    const cube = new THREE.Mesh(geometry, material);
    // 设置网格位置
    cube.position.x = x;
    // 网格添加到场景
    this.scene.add(cube);
    return cube;
  }

  // 创建多个网格的立方体
  animation() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const cubes = [
      this.makeInstance(geometry, 0x8844aa, -2),
      this.makeInstance(geometry, 0x44aa88, 0),
      this.makeInstance(geometry, 0xaa8844, 2),
    ];
    const render = (time?: number) => {
      time *= 0.001;
      cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });
      console.log(this.resizeRendererToDisplaySize(this.webGl, this.camera))
      // 场景和摄像机传递给渲染器
      this.webGl.render(this.scene, this.camera);
      // 动画
      requestAnimationFrame(render);
    };
    render();
  }
}

// 球体
class threeTemplate2 {
  // 渲染器
  webGl: THREE.WebGLRenderer;
  // 透视摄像机
  camera: THREE.PerspectiveCamera;
  // 场景
  scene: THREE.Scene;
  // 灯光
  light: THREE.AmbientLight;
  // 轴
  axes: THREE.AxesHelper;

  constructor() {
    this.scene = new THREE.Scene(); // 场景
    this.webGl = this.createRender(); // 渲染器
    this.camera = this.createCamera(); // 相机
    this.axes = this.showAxes(); // 轴
    this.light = this.createLight(); // 光
    this.addSphere(); // 添加球体
  }

  // 显示在屏幕的轴
  showAxes() {
    const axes = new THREE.AxesHelper(20);
    this.scene.add(axes);
    return axes;
  }

  // 渲染器
  createRender() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000)); // 设置场景背景色
    renderer.setSize(window.innerWidth, window.innerHeight); // 设置尺寸
    document.body.appendChild(renderer.domElement);
    return renderer;
  }

  // 创建相机
  createCamera() {
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(-30, 40, 30);
    camera.lookAt(this.scene.position);
    return camera;
  }

  // 创建光
  createLight() {
    const ambienLight = new THREE.AmbientLight(0xffffff); // 环境光
    this.scene.add(ambienLight);
    return ambienLight;
  }

  // 添加球体
  addSphere() {
    // 定义物体的几何结构
    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    // 定义物体的材质
    const sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x7777ff,
    });
    // 用几何结构和材质来创建物体
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // 定位球体中心的位置
    sphere.position.set(15, 0, 0);
    // 把球体添加进场景中
    this.scene.add(sphere);
  }

  render() {
    this.webGl.render(this.scene, this.camera);
  }
}

new threeTemplate1().animation();
