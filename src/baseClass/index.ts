/*
 * @Description 超类
 * @Author bihongbin
 * @Date 2021-08-12 09:14:00
 * @LastEditors bihongbin
 * @LastEditTime 2021-08-13 09:59:47
 */
import * as THREE from 'three';

class BaseClass {
  constructor() {}
  // 自动调整canvas大小和摄像机位置（浏览器宽高不影响预览效果）
  resizeRendererToDisplaySize(
    renderer: THREE.WebGLRenderer,
    camera?: THREE.PerspectiveCamera,
  ) {
    const canvas = renderer.domElement;
    // 分辨率倍数
    const pixelRatio = window.devicePixelRatio;
    const clientWidth = canvas.clientWidth;
    const clientHeight = canvas.clientHeight;
    const width = (clientWidth * pixelRatio) | 0;
    const height = (clientHeight * pixelRatio) | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      if (camera) {
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
      }
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
}

export default BaseClass;
