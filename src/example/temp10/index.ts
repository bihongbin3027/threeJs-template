import * as THREE from "three";
import Core from "@/basic/core";

export default class ThreeTemplate9 extends Core {
  physicsWorld: Ammo.btDiscreteDynamicsWorld;
  rigidBodies: any[] = [];
  tmpTrans: Ammo.btTransform;
  STATE = { DISABLE_DEACTIVATION: 4 };

  constructor(data: { el: string }) {
    super();

    // 初始化scene, canvas, camera, orbitControls, ground, sky
    this.warpSpeed(data).then(() => {
      this.ammoInit();
    });
  }

  ammoInit() {
    Ammo().then(() => {
      this.tmpTrans = new Ammo.btTransform();
      // 设置物理世界
      this.setupPhysicsWorld();
    });
  }

  /**
   * @description 设置物理世界
   * @author bihongbin
   * @param {*}
   * @return {*}
   * @Date 2022-02-09 17:42:50
   */
  setupPhysicsWorld() {
    let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
      dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
      overlappingPairCache = new Ammo.btDbvtBroadphase(),
      solver = new Ammo.btSequentialImpulseConstraintSolver();
    this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(
      dispatcher,
      overlappingPairCache,
      solver,
      collisionConfiguration
    );
    this.physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));
  }

  render() {
    const animate = () => {
      requestAnimationFrame(animate);

      this.updateRender();
    };

    animate();
  }
}
