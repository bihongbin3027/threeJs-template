import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Core from "@/basic/core";

/**
 * @description 创建轨道控制器
 * @author bihongbin
 * @param {Core} _this 传入Core的this
 * @return {*} OrbitControls
 * @Date 2022-01-10 15:52:26
 */
function createOrbitControls(_this: Core) {
  const controls = new OrbitControls(_this.camera, _this.renderer.domElement);

  // 相机向外移动
  controls.maxDistance = 200;
  // 相机向内移动
  controls.minDistance = 1;

  controls.addEventListener("change", () => {
    // 更新场景
    _this.updateRender();
  });

  return (_this.orbitControls = controls);
}

export { createOrbitControls };
