/*
 * @Description 超类
 * @Author bihongbin
 * @Date 2021-08-12 09:14:00
 * @LastEditors biHongBin
 * @LastEditTime 2021-08-15 15:47:48
 */
import * as THREE from 'three';
import { GUI } from 'dat.gui';

// 坐标轴和网格
class AxisGridHelper {
  _visible: boolean;
  axes: THREE.AxesHelper;
  grid: THREE.GridHelper;

  constructor(node: any, units = 10) {
    const axes = new THREE.AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 2; // after the grid
    node.add(axes);

    const grid = new THREE.GridHelper(units, units);
    grid.material.depthTest = false;
    grid.renderOrder = 1;
    node.add(grid);

    this.grid = grid;
    this.axes = axes;
    this.visible = false;
  }
  get visible() {
    return this._visible;
  }
  set visible(v) {
    this._visible = v;
    this.grid.visible = v;
    this.axes.visible = v;
  }
}

class BaseClass {
  gui: GUI;

  constructor() {}

  // 生成坐标轴和网格
  makeAxisGrid(node: any, label: string, units?: number) {
    if (!this.gui) {
      this.gui = new GUI();
    }

    const helper = new AxisGridHelper(node, units);
    this.gui.add(helper, 'visible').name(label);
  }

  // 透视摄像机 PerspectiveCamera 自适应渲染
  resizePerspectiveCameraDisplaySize(
    renderer: THREE.WebGLRenderer,
    camera?: THREE.PerspectiveCamera,
  ) {
    const resize = () => {
      const canvas = renderer.domElement;
      // 分辨率倍数
      const pixelRatio = window.devicePixelRatio;
      const clientWidth = canvas.clientWidth;
      const clientHeight = canvas.clientHeight;
      const width = (clientWidth * pixelRatio) | 0;
      const height = (clientHeight * pixelRatio) | 0;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        if (camera) {
          camera.aspect = clientWidth / clientHeight;
          camera.updateProjectionMatrix();
        }
        renderer.setSize(width, height, false);
      }
    };
    resize();
    window.addEventListener('resize', resize);
  }
}

export default BaseClass;
