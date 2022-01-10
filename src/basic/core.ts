import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createScene } from "@/basic/scene";
import { createRenderer } from "@/basic/renderer";
import { createCamera } from "@/basic/camera";
import { createOrbitControls } from "@/basic/orbitControls";
import { createLight } from "@/basic/light";
import { createSky } from "@/basic/sky";
import { createGround } from "@/basic/ground";

interface LightClumpType {
  // 半球光
  hemiLight: THREE.HemisphereLight;
  // 方向光
  dirLight: THREE.DirectionalLight;
}

class Core {
  // 场景
  public scene: THREE.Scene;
  // 渲染器
  public renderer: THREE.WebGLRenderer;
  // 透视摄像机
  public camera: THREE.PerspectiveCamera;
  // 轨道控制器
  public orbitControls: OrbitControls;
  // 光
  public light: LightClumpType = { hemiLight: undefined, dirLight: undefined };
  // 天空
  public sky: THREE.Mesh;
  // 地面
  public ground: THREE.Mesh;

  // 更新渲染
  updateRender() {
    this.renderer.render(this.scene, this.camera);
  }

  // 设置场景（渲染器、摄像机、光源、轨道控制器、天空、地面）
  async warpSpeed(data?: { el: string }) {
    const scene = createScene(this),
      renderer = createRenderer(this, data.el),
      camera = createCamera(this),
      orbitControls = createOrbitControls(this),
      light = createLight(this),
      sky = createSky(this),
      ground = await createGround(this);

    return {
      scene,
      renderer,
      camera,
      orbitControls,
      light,
      sky,
      ground,
    };
  }
}

export default Core;
