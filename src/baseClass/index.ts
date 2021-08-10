import * as THREE from 'three';

class BaseClass {
  constructor() {}
  // 创建渲染器
  createRender() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    return renderer;
  }
  // 创建摄像机
  createCamera(fov?: number, aspect?: number, near?: number, far?: number) {
    return new THREE.PerspectiveCamera(fov, aspect, near, far);
  }
}

export default BaseClass;
