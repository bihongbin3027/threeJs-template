import * as THREE from "three";
import Core from "@/basic/core";

export default class ThreeTemplate9 extends Core {
  physicsWorld: Ammo.btDiscreteDynamicsWorld;
  tmpTrans: Ammo.btTransform;

  constructor(data: { el: string }) {
    super();

    // 初始化scene, canvas, camera, orbitControls, ground, sky
    this.warpSpeed(data).then(() => {
      this.initAmmo();
      // this.initThree();
      // this.render();
    });
  }

  initAmmo() {
    const setupPhysicsWorld = () => {};
    Ammo().then((api) => {
      this.tmpTrans = new api.btTransform();
    });
  }

  initThree() {}

  render() {
    const animate = () => {
      requestAnimationFrame(animate);

      this.updateRender();
    };

    animate();
  }
}
