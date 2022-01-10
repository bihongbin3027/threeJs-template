import * as THREE from "three";
import Core from "@/basic/core";

/**
 * @description 创建场景
 * @author bihongbin
 * @param {Core} _this 传入Core的this
 * @return {*} Scene
 * @Date 2022-01-10 15:53:45
 */
function createScene(_this: Core) {
  const scene = new THREE.Scene();
  const axesHelper = new THREE.AxesHelper(10);

  scene.background = new THREE.Color().setHSL(0.6, 0, 1);
  // 雾
  scene.fog = new THREE.Fog(scene.background, 1, 5000);
  scene.add(axesHelper);

  return (_this.scene = scene);
}

export { createScene };
