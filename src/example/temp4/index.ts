/*
 * @Description 旋转坦克
 * @Author biHongBin
 * @Date 2021-08-15 15:37:12
 * @LastEditors bihongbin
 * @LastEditTime 2021-08-16 11:59:10
 */
import * as THREE from "three";
import BaseClass from "../../baseClass";

export default class ThreeTemplate4 extends BaseClass {
  // 场景
  scene: THREE.Scene;
  // 渲染器
  canvas: THREE.WebGLRenderer;
  // 摄像机
  camera: THREE.PerspectiveCamera;

  // 坦克
  tank = new THREE.Object3D();

  // 移动线路
  walkingLine = new THREE.SplineCurve([
    new THREE.Vector2(-10, 0),
    new THREE.Vector2(-5, 5),
    new THREE.Vector2(0, 0),
    new THREE.Vector2(5, -5),
    new THREE.Vector2(10, 0),
    new THREE.Vector2(5, 10),
    new THREE.Vector2(-5, 10),
    new THREE.Vector2(-10, -10),
    new THREE.Vector2(-15, -8),
    new THREE.Vector2(-10, 0),
  ]);

  // Object3D集合
  muster_object3D: {
    targetOrbit: THREE.Object3D;
    targetBob: THREE.Object3D;
    turretPivot: THREE.Object3D;
  } = {
    targetOrbit: undefined,
    targetBob: undefined,
    turretPivot: undefined,
  };

  // 网格集合
  muster_mesh: {
    targetMesh: THREE.Mesh;
    wheelMeshes: THREE.Mesh[];
  } = {
    targetMesh: undefined,
    wheelMeshes: [],
  };

  // 材质集合
  muster_material: {
    targetMaterial: THREE.MeshPhongMaterial;
  } = {
    targetMaterial: undefined,
  };

  constructor() {
    super();
    // 创建场景
    this.scene = this.createScene();
    // 创建渲染器
    this.canvas = this.createCanvas();
    // 创建透视摄像机
    this.camera = this.createCamera();
    // 透视摄像机自适应渲染
    super.resizePerspectiveCameraDisplaySize(this.canvas, this.camera);

    // 创建地面
    this.createGround();
    // 创建坦克
    this.createTank();
    // 创建目标球体
    this.createRotatingTarget();
    // 创建走动路线
    this.createWalkingLine();
  }

  // 场景
  createScene() {
    const scene = new THREE.Scene();

    {
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(0, 20, 0);

      // 投下阴影
      light.castShadow = true;
      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 2048;

      const d = 50;
      light.shadow.camera.left = -d;
      light.shadow.camera.right = d;
      light.shadow.camera.top = d;
      light.shadow.camera.bottom = -d;
      light.shadow.camera.near = 1;
      light.shadow.camera.far = 50;
      light.shadow.bias = 0.001;

      scene.add(light);
    }

    {
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(1, 2, 4);
      scene.add(light);
    }

    return scene;
  }

  // 渲染器
  createCanvas() {
    const renderer = new THREE.WebGLRenderer();
    // 设置颜色
    renderer.setClearColor(0xaaaaaa);
    // 允许在场景中使用阴影贴图
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    return renderer;
  }

  // 透视摄像机
  createCamera(fov = 40) {
    const aspect = 2;
    const zNear = 0.1;
    const zFar = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
    // multiplyScalar乘标量
    camera.position.set(8, 4, 10).multiplyScalar(3);
    camera.lookAt(0, 0, 0);
    return camera;
  }

  // 创建地面
  createGround() {
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xcc8866 });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = Math.PI * -0.5;
    groundMesh.receiveShadow = true;
    this.scene.add(groundMesh);
  }

  // 创建坦克
  createTank() {
    const carWidth = 4;
    const carHeight = 1;
    const carLength = 8;

    // 身体
    const bodyGeometry = new THREE.BoxGeometry(carWidth, carHeight, carLength); // 四边形
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x6688aa });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.y = 1.4;
    this.tank.add(bodyMesh);

    // 轮子
    const wheelRadius = 1;
    const wheelThickness = 0.5; // 厚度
    const wheelSegments = 6; // 6个段
    const wheelGeometry = new THREE.CylinderGeometry(
      wheelRadius,
      wheelRadius,
      wheelThickness,
      wheelSegments
    ); // 圆柱
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const wheelPositions = [
      [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, carLength / 3],
      [carWidth / 2 + wheelThickness / 2, -carHeight / 2, carLength / 3],
      [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, 0],
      [carWidth / 2 + wheelThickness / 2, -carHeight / 2, 0],
      [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, -carLength / 3],
      [carWidth / 2 + wheelThickness / 2, -carHeight / 2, -carLength / 3],
    ];
    this.muster_mesh.wheelMeshes = wheelPositions.map((position) => {
      const mesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
      mesh.position.set(position[0], position[1], position[2]);
      mesh.rotation.z = Math.PI * -0.5;
      mesh.castShadow = true;
      bodyMesh.add(mesh);
      return mesh;
    });

    // 圆顶
    const domeRadius = 2;
    const domeWidthSubdivisions = 12;
    const domeHeightSubdivisions = 12;
    const domePhiStart = 0;
    const domePhiEnd = Math.PI * 2;
    const domeThetaStart = 0;
    const domeThetaEnd = Math.PI * 0.5;
    // 球体
    const domeGeometry = new THREE.SphereGeometry(
      domeRadius,
      domeWidthSubdivisions,
      domeHeightSubdivisions,
      domePhiStart,
      domePhiEnd,
      domeThetaStart,
      domeThetaEnd
    );
    const domeMaterial = new THREE.MeshPhongMaterial({ color: 0x6688aa });
    const domeMesh = new THREE.Mesh(domeGeometry, domeMaterial);
    domeMesh.castShadow = true;
    domeMesh.position.y = 0.5;
    bodyMesh.add(domeMesh);

    // 炮塔
    const turretWidth = 0.1;
    const turretHeight = 0.1;
    const turretLength = carLength * 0.75 * 0.2;
    const turretGeometry = new THREE.BoxGeometry(
      turretWidth,
      turretHeight,
      turretLength
    );
    const turretMaterial = new THREE.MeshPhongMaterial({ color: 0x6688aa });
    const turretMesh = new THREE.Mesh(turretGeometry, turretMaterial);
    const turretPivot = new THREE.Object3D();
    turretMesh.castShadow = true;
    turretMesh.position.z = turretLength * 0.5;
    turretPivot.scale.set(5, 5, 5);
    turretPivot.position.y = 0.5;
    turretPivot.add(turretMesh);
    bodyMesh.add(turretPivot);

    this.muster_object3D.turretPivot = turretPivot;
    this.scene.add(this.tank);
  }

  // 目标球体
  createRotatingTarget() {
    const targetGeometry = new THREE.SphereGeometry(0.5, 6, 3);
    const targetMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      flatShading: true,
    });
    const targetMesh = new THREE.Mesh(targetGeometry, targetMaterial);
    const targetOrbit = new THREE.Object3D();
    const targetElevation = new THREE.Object3D();
    const targetBob = new THREE.Object3D();
    targetMesh.castShadow = true;
    targetOrbit.add(targetElevation);
    targetElevation.position.z = 16;
    targetElevation.position.y = 8;
    targetElevation.add(targetBob);
    targetBob.add(targetMesh);

    this.muster_object3D.targetOrbit = targetOrbit;
    this.muster_object3D.targetBob = targetBob;
    this.muster_mesh.targetMesh = targetMesh;
    this.muster_material.targetMaterial = targetMaterial;

    this.scene.add(targetOrbit);
  }

  // 走动线路
  createWalkingLine() {
    const points = this.walkingLine.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const splineObject = new THREE.Line(geometry, material);
    splineObject.rotation.x = Math.PI * 0.5;
    splineObject.position.y = 0.05;

    this.scene.add(splineObject);
  }

  render() {
    const targetPosition = new THREE.Vector3();
    const tankPosition = new THREE.Vector2();
    const tankTarget = new THREE.Vector2();

    const animation = (time: number) => {
      time *= 0.001;

      // 目标球体弹动
      this.muster_object3D.targetOrbit.rotation.y = time * 0.27;
      this.muster_object3D.targetBob.position.y = Math.sin(time * 2) * 4;
      this.muster_mesh.targetMesh.rotation.x = time * 7;
      this.muster_mesh.targetMesh.rotation.y = time * 13;
      this.muster_material.targetMaterial.emissive.setHSL(
        (time * 10) % 1,
        1,
        0.25
      );
      this.muster_material.targetMaterial.color.setHSL(
        (time * 10) % 1,
        1,
        0.25
      );

      // 轮子转动
      this.muster_mesh.wheelMeshes.forEach((obj) => {
        obj.rotation.x = time * 3;
      });

      // 坦克移动
      const tankTime = time * 0.05;
      this.walkingLine.getPointAt(tankTime % 1, tankPosition);
      this.walkingLine.getPointAt((tankTime + 0.01) % 1, tankTarget);
      this.tank.position.set(tankPosition.x, 0, tankPosition.y);
      this.tank.lookAt(tankTarget.x, 0, tankTarget.y);

      // 炮塔面向目标球体移动
      this.muster_mesh.targetMesh.getWorldPosition(targetPosition);
      this.muster_object3D.turretPivot.lookAt(targetPosition);

      this.canvas.render(this.scene, this.camera);
      requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  }
}
