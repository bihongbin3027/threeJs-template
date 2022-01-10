import * as THREE from "three";
import Core from "@/basic/core";

/**
 * @description 创建地面
 * @author bihongbin
 * @param {Core} _this 传入Core的this
 * @return {*} 地面Mesh
 * @Date 2022-01-10 16:24:57
 */
async function createGround(_this: Core) {
  const planeSize = 10000;
  const meadowJpg = require("@/assets/images/meadow.jpg");
  const textureLoader = new THREE.TextureLoader();
  const texture = await textureLoader.loadAsync(meadowJpg);

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(planeSize, planeSize);

  const geometry = new THREE.PlaneBufferGeometry(planeSize, planeSize);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    // 双面材质
    side: THREE.DoubleSide,
  });
  const groundMesh = new THREE.Mesh(geometry, material);

  groundMesh.name = "ground";
  groundMesh.rotation.x = Math.PI * -0.5;
  // 可以接收阴影
  groundMesh.receiveShadow = true;

  // 开启多边形偏移
  material.polygonOffset = true;
  // 多边形偏移 摄像机距离：正值-远离相机 负值-靠近相机
  material.polygonOffsetFactor = 1;

  _this.scene.add(groundMesh);
  // 更新场景
  _this.updateRender();

  return (_this.ground = groundMesh);
}

export { createGround };
