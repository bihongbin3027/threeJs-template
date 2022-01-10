import * as THREE from "three";
import Core from "@/basic/core";

/**
 * @description 创建渲染器
 * @author bihongbin
 * @param {*} _this 传入Core的this
 * @param {string} el dom元素id
 * @return {*} WebGLRenderer
 * @Date 2022-01-10 16:09:05
 */
function createRenderer(_this: Core, el: string) {
  const renderer = new THREE.WebGLRenderer({
    // 消除锯齿
    antialias: true,
  });

  // 设置设备像素比（防止 HiDPI 显示器模糊）
  renderer.setPixelRatio(window.devicePixelRatio);
  // 修改输出编码
  renderer.outputEncoding = THREE.sRGBEncoding;
  // 启用阴影
  renderer.shadowMap.enabled = true;

  if (el) {
    document.getElementById(el).appendChild(renderer.domElement);
  } else {
    document.body.appendChild(renderer.domElement);
  }

  return (_this.renderer = renderer);
}

export { createRenderer };
