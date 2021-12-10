/*
 * @Description 建筑
 * @Author bihongbin
 * @Date 2021-11-02 16:10:03
 * @LastEditors bihongbin
 * @LastEditTime 2021-12-10 11:59:24
 */
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import Core from "@/basic/core";

export default class ThreeTemplate9 extends Core {
  carObject: THREE.Group = new THREE.Group();
  // 汽车移动线路
  walkingLing: THREE.SplineCurve;

  // 地面元素大小
  planeSize = 100;

  constructor(data: { el: string }) {
    super();

    // 设置场景（scene, canvas, camera, orbitControls, ground, sky）
    this.warpSpeed(data).then((res) => {
      // 创建内容
      this.createContent();
    });
  }

  // 内容
  createContent() {
    // 创建建筑
    this.createBuilding();
    // 创建马路
    this.createRoad();
    // 创建汽车
    this.createCar();
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

    // 马路材质
    {
      const color = 0x4b5161;

      const roundGeometry = new THREE.CircleGeometry(width / 2, 30, 0, Math.PI);
      const roundMaterial = new THREE.MeshBasicMaterial({ color });
      const roundLeftMesh = new THREE.Mesh(roundGeometry, roundMaterial);
      const roundRightMesh = roundLeftMesh.clone();

      const planeGeometry = new THREE.PlaneGeometry(width, height);
      const planeMaterial = new THREE.MeshBasicMaterial({ color });
      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

      roundLeftMesh.position.y = height / 2;
      roundRightMesh.position.y = (height / 2) * -1;
      roundRightMesh.rotation.z = Math.PI;

      // 渲染顺序（小的先渲染，大的后渲染）
      roadObj.renderOrder = 2;
      roadObj.rotation.x = Math.PI * -0.5;

      roadObj.add(roundLeftMesh);
      roadObj.add(roundRightMesh);
      roadObj.add(planeMesh);
    }

    // 马路位置
    {
      // x,y,z
      const roadPositions = [
        [this.planeSize / -2 + outerRing, 0, 0],
        [0, 0, this.planeSize / -2 + outerRing],
        [this.planeSize / 2 - outerRing, 0, 0],
        [0, 0, this.planeSize / 2 - outerRing],
      ];

      for (let [index, item] of roadPositions.entries()) {
        const clone = roadObj.clone();

        if (index % 2 !== 0) {
          clone.rotation.z = Math.PI * 0.5;
        }

        clone.position.set(item[0], item[1], item[2]);
        this.scene.add(clone);
      }
    }

    {
      let points: THREE.Vector2[] = [];

      this.walkingLing = new THREE.SplineCurve([
        new THREE.Vector2(height / -2, height / 2),
        new THREE.Vector2(height / -2, height / -2),
        new THREE.Vector2(height / 2, height / -2),
        new THREE.Vector2(height / 2, height / 2),
        new THREE.Vector2(height / -2, height / 2),
      ]);

      points = this.walkingLing.getPoints(4);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
      const splineMesh = new THREE.Line(geometry, material);

      splineMesh.rotation.x = Math.PI * 0.5;
      this.scene.add(splineMesh);
    }
  }

  // 汽车
  createCar() {
    const outerRing = this.planeSize / 3;
    // 车宽
    const carWidth = 3;
    // 车高
    const carHeight = 2;
    // 车长
    const carLength = 6;

    this.carObject.position.x = (this.planeSize - outerRing * 2) / 2;

    // 车身
    {
      {
        // 前后
        const getCarBeforeAndAfterTexture = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = 64;
          canvas.height = 32;

          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);

          context.fillStyle = "#666666";
          context.fillRect(8, 8, 48, 17);

          return new THREE.CanvasTexture(canvas);
        };
        // 左右
        const getCarSideTexture = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = 128;
          canvas.height = 32;

          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);

          context.fillStyle = "#666666";
          context.fillRect(10, 8, 38, 17);
          context.fillRect(58, 8, 60, 17);

          return new THREE.CanvasTexture(canvas);
        };

        const carBeforeAndAfterTexture = getCarBeforeAndAfterTexture();
        const carSideTexture = getCarSideTexture();

        const geometry = new THREE.BoxBufferGeometry(
          carWidth / 1.5,
          carHeight / 2,
          carLength / 2
        );
        const mesh = new THREE.Mesh(geometry, [
          // 左
          new THREE.MeshLambertMaterial({ map: carSideTexture }),
          // 右
          new THREE.MeshLambertMaterial({ map: carSideTexture }),
          // 上
          new THREE.MeshLambertMaterial({ color: 0xffffff }),
          // 下
          new THREE.MeshLambertMaterial({ color: 0xffffff }),
          // 前
          new THREE.MeshLambertMaterial({ map: carBeforeAndAfterTexture }),
          // 后
          new THREE.MeshLambertMaterial({ map: carBeforeAndAfterTexture }),
        ]);
        mesh.position.y = carHeight / 2;
        mesh.position.z = -carLength / 15;
        // 投射阴影
        mesh.castShadow = true;
        this.carObject.add(mesh);
      }

      {
        const geometry = new THREE.BoxGeometry(
          carWidth,
          carHeight / 2,
          carLength
        );
        const material = new THREE.MeshLambertMaterial({ color: 0xcd2e2b });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = "shell";
        // 投射阴影
        mesh.castShadow = true;
        this.carObject.add(mesh);
      }
    }

    // 轮胎
    {
      // 圆环半径
      const radius = 0.4;
      // 管道半径
      const tube = radius / 2;
      // 圆环分段数
      const radialSegments = 8;
      // 管道分段数
      const tubularSegments = 100;

      const geometry = new THREE.TorusGeometry(
        radius,
        tube,
        radialSegments,
        tubularSegments
      );
      const material = new THREE.MeshLambertMaterial({ color: 0x333333 });

      // 4个轮胎位置
      const wheelPositions = [
        [-carWidth / 2, -carHeight / 2 + radius, carLength / 3],
        [carWidth / 2, -carHeight / 2 + radius, carLength / 3],
        [-carWidth / 2, -carHeight / 2 + radius, -carLength / 3],
        [carWidth / 2, -carHeight / 2 + radius, -carLength / 3],
      ];
      wheelPositions.map((position) => {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position[0], position[1], position[2]);
        mesh.rotation.y = Math.PI * -0.5;
        // 投射阴影
        mesh.castShadow = true;
        this.carObject.add(mesh);
        return mesh;
      });

      // 调整汽车y位置刚好到地面
      this.carObject.position.y = carHeight / 2 + tube;
    }

    this.scene.add(this.carObject);
  }

  // 渲染内容
  render() {
    const carPosition = new THREE.Vector2();
    const carTarget = new THREE.Vector2();

    const animation = (time: number) => {
      time *= 0.001;

      // 移动小汽车
      if (this.walkingLing) {
        const carTime = time * 0.05;
        this.walkingLing.getPointAt(carTime % 1, carPosition);
        // console.log("carPosition", carPosition);
        this.walkingLing.getPointAt((carTime + 0.01) % 1, carTarget);

        this.carObject.position.set(carPosition.x, 1.2, carPosition.y);
        this.carObject.lookAt(carTarget.x, 1.2, carTarget.y);

        console.log("carPosition", carPosition);
        console.log("carTarget", carTarget);
        // this.camera.position.set(carPosition.x - 10, 5, carPosition.y + 5);
        // this.camera.lookAt(carTarget.x - 10, 5, carTarget.y + 5);
      }

      this.rootCanvas.render(this.scene, this.camera);
      requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  }
}
