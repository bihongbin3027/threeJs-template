import * as THREE from "three";
import Core from "@/basic/core";

/**
 * @description 创建相机
 * @author bihongbin
 * @param {Core} _this 传入Core的this
 * @return {*} Camera
 * @Date 2022-01-10 16:11:54
 */
function createCamera(_this: Core) {
  const fov = 50,
    aspect = window.innerWidth / window.innerHeight,
    near = 0.1,
    far = 5000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // 相机自适应
  const resize = () => {
    const canvas = _this.renderer.domElement;
    // 分辨率倍数
    const pixelRatio = window.devicePixelRatio;
    const clientWidth = canvas.clientWidth;
    const clientHeight = canvas.clientHeight;
    const width = (clientWidth * pixelRatio) | 0;
    const height = (clientHeight * pixelRatio) | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      _this.renderer.setSize(width, height, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      _this.renderer.render(_this.scene, camera);
    }
  };

  resize();
  window.addEventListener("resize", resize);
  camera.position.set(35, 10, 15);

  return (_this.camera = camera);
}

export { createCamera };
