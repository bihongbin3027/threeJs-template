/*
 * @Description 建筑
 * @Author bihongbin
 * @Date 2021-11-02 16:10:03
 * @LastEditors bihongbin
 * @LastEditTime 2021-11-17 12:01:26
 */
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import Core from "@/basic/core";

export default class ThreeTemplate9 extends Core {
  planeSize = 100;

  constructor(data: { el: string }) {
    super();

    // 设置场景（scene, canvas, camera, ground, orbitControls）
    this.warpSpeed(data);

    // 创建内容
    this.createContent();
  }

  // 内容
  createContent() {
    // 创建建筑
    this.createBuilding();
    // 创建马路
    this.createRoad();
  }

  // 创建obj模型
  async createObjLoader(param: {
    mtlPath: string;
    objPath: string;
    action: (data: THREE.Group) => void;
  }) {
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();

    const mtl = await mtlLoader.loadAsync(param.mtlPath);
    objLoader.setMaterials(mtl);
    const group = await objLoader.loadAsync(param.objPath);
    param.action(group);

    this.scene.add(group);
  }

  // 建筑
  createBuilding() {
    this.createObjLoader({
      mtlPath: "/static/model/building/houseA_obj.mtl",
      objPath: "/static/model/building/houseA_obj.obj",
      action: (data) => {
        data.scale.set(0.1, 0.1, 0.1);
      },
    });
  }

  // 马路
  createRoad() {
    const roadObj = new THREE.Group();
    const outerRing = this.planeSize / 3;
    const width = 4;
    const height = this.planeSize - outerRing * 2;
    const color = 0x4b5161;

    const roundGeometry = new THREE.CircleGeometry(width / 2, 30, 0, Math.PI);
    const roundMaterial = new THREE.MeshBasicMaterial({ color });
    const roundLeftMesh = new THREE.Mesh(roundGeometry, roundMaterial);
    const roundRightMesh = roundLeftMesh.clone();

    const planeGeometry = new THREE.PlaneGeometry(width, height);
    const planeMaterial = new THREE.MeshBasicMaterial({ color });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

    // x,y,z
    const roadPositions = [
      [this.planeSize / -2 + outerRing, 0, 0],
      [0, 0, this.planeSize / -2 + outerRing],
      [this.planeSize / 2 - outerRing, 0, 0],
      [0, 0, this.planeSize / 2 - outerRing],
    ];

    roundLeftMesh.position.y = height / 2;
    roundRightMesh.position.y = (height / 2) * -1;
    roundRightMesh.rotation.z = Math.PI;

    // 渲染顺序（小的先渲染，大的后渲染）
    roadObj.renderOrder = 2;
    roadObj.rotation.x = Math.PI * -0.5;

    roadObj.add(roundLeftMesh);
    roadObj.add(roundRightMesh);
    roadObj.add(planeMesh);

    for (let [index, item] of roadPositions.entries()) {
      const clone = roadObj.clone();

      if (index % 2 !== 0) {
        clone.rotation.z = Math.PI * 0.5;
      }

      clone.position.set(item[0], item[1], item[2]);
      this.scene.add(clone);
    }
  }

  // 渲染内容
  render() {
    const animation = (time: number) => {
      console.log("requestAnimationFrame", time);

      this.rootCanvas.render(this.scene, this.camera);
      requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  }
}
