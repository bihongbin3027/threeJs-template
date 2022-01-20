import * as THREE from "three";
import * as CANNON from "cannon-es";
import Core from "@/basic/core";

export default class ThreeTemplate9 extends Core {
  lastCallTime: number;
  world: CANNON.World;
  body: CANNON.Body;
  mesh: THREE.Mesh;

  constructor(data: { el: string }) {
    super();

    // 初始化设置scene, canvas, camera, orbitControls, ground, sky
    this.warpSpeed(data).then(() => {
      this.initThree();
      this.initCannon();
      this.render();
    });
  }

  initThree() {
    const geometry = new THREE.BoxBufferGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
  }

  initCannon() {
    this.body = new CANNON.Body({
      mass: 1,
    });
    this.world = new CANNON.World();
    const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
    this.body.addShape(shape);
    this.body.angularVelocity.set(0, 10, 0);
    this.body.angularDamping = 0.5;
    this.world.addBody(this.body);
  }

  render() {
    const animate = () => {
      requestAnimationFrame(animate);

      this.mesh.position.copy(this.body.position as unknown as THREE.Vector3);
      this.mesh.quaternion.copy(
        this.body.quaternion as unknown as THREE.Quaternion
      );

      this.world.fixedStep();
      this.updateRender();
    };

    animate();
  }
}
