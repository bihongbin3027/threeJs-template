/*
 * @Description 创建灯光
 * @Author bihongbin
 * @Date 2022-01-08 17:55:07
 * @LastEditors bihongbin
 * @LastEditTime 2022-01-10 16:21:24
 */
import * as THREE from "three";
import Core from "@/basic/core";

/**
 * @description 创建灯光
 * @author bihongbin
 * @param {Core} _this 传入Core的this
 * @return {*} Light
 * @Date 2022-01-10 16:20:25
 */
function createLight(_this: Core) {
  // 半球光
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  hemiLight.position.set(0, 50, 0);
  _this.scene.add(hemiLight);

  // 方向光
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.color.setHSL(0.1, 1, 0.95);
  dirLight.position.set(-1, 1.75, 1);
  dirLight.position.multiplyScalar(30);
  // 阴影投射
  dirLight.castShadow = true;

  _this.scene.add(hemiLight);
  _this.scene.add(dirLight);

  return (_this.light = {
    hemiLight,
    dirLight,
  });
}

export { createLight };
