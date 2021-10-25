/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 6531:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/reflect/construct.js
var construct = __webpack_require__(1068);
var construct_default = /*#__PURE__*/__webpack_require__.n(construct);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/helpers/esm/classCallCheck.js
var classCallCheck = __webpack_require__(8420);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/helpers/esm/createClass.js
var createClass = __webpack_require__(7344);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/helpers/esm/assertThisInitialized.js
var assertThisInitialized = __webpack_require__(5281);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/helpers/esm/get.js + 1 modules
var get = __webpack_require__(8486);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/helpers/esm/inherits.js + 1 modules
var inherits = __webpack_require__(4441);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/helpers/esm/possibleConstructorReturn.js + 1 modules
var possibleConstructorReturn = __webpack_require__(1770);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/helpers/esm/getPrototypeOf.js
var getPrototypeOf = __webpack_require__(3362);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/helpers/esm/defineProperty.js
var defineProperty = __webpack_require__(4845);
// EXTERNAL MODULE: ./node_modules/three/build/three.module.js
var three_module = __webpack_require__(2212);
// EXTERNAL MODULE: ./node_modules/three/examples/jsm/controls/OrbitControls.js
var OrbitControls = __webpack_require__(9365);
// EXTERNAL MODULE: ./node_modules/three/examples/jsm/loaders/OBJLoader.js
var OBJLoader = __webpack_require__(7011);
// EXTERNAL MODULE: ./node_modules/three/examples/jsm/loaders/MTLLoader.js
var MTLLoader = __webpack_require__(6023);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.function.name.js
var es_function_name = __webpack_require__(8309);
// EXTERNAL MODULE: ./node_modules/dat.gui/build/dat.gui.module.js
var dat_gui_module = __webpack_require__(4376);
;// CONCATENATED MODULE: ./src/baseClass/index.ts





/*
 * @Description 超类
 * @Author bihongbin
 * @Date 2021-08-12 09:14:00
 * @LastEditors bihongbin
 * @LastEditTime 2021-10-25 16:00:01
 */

 // 坐标轴和网格

var AxisGridHelper = /*#__PURE__*/function () {
  function AxisGridHelper(node) {
    var units = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

    (0,classCallCheck/* default */.Z)(this, AxisGridHelper);

    (0,defineProperty/* default */.Z)(this, "_visible", void 0);

    (0,defineProperty/* default */.Z)(this, "axes", void 0);

    (0,defineProperty/* default */.Z)(this, "grid", void 0);

    var axes = new three_module/* AxesHelper */.y8_(); // axes.material.depthTest = false;

    axes.renderOrder = 2; // after the grid

    node.add(axes);
    var grid = new three_module/* GridHelper */.VLJ(units, units); // grid.material.depthTest = false;

    grid.renderOrder = 1;
    node.add(grid);
    this.grid = grid;
    this.axes = axes;
    this.visible = false;
  }

  (0,createClass/* default */.Z)(AxisGridHelper, [{
    key: "visible",
    get: function get() {
      return this._visible;
    },
    set: function set(v) {
      this._visible = v;
      this.grid.visible = v;
      this.axes.visible = v;
    }
  }]);

  return AxisGridHelper;
}();

var BaseClass = /*#__PURE__*/function () {
  function BaseClass() {
    (0,classCallCheck/* default */.Z)(this, BaseClass);

    (0,defineProperty/* default */.Z)(this, "gui", void 0);
  } // 生成坐标轴和网格


  (0,createClass/* default */.Z)(BaseClass, [{
    key: "makeAxisGrid",
    value: function makeAxisGrid(node, label, units) {
      if (!this.gui) {
        this.gui = new dat_gui_module/* GUI */.XS();
      }

      var helper = new AxisGridHelper(node, units);
      this.gui.add(helper, 'visible').name(label);
    } // 透视摄像机 PerspectiveCamera 自适应渲染

  }, {
    key: "resizePerspectiveCameraDisplaySize",
    value: function resizePerspectiveCameraDisplaySize(renderer, camera, scene) {
      var resize = function resize() {
        var canvas = renderer.domElement; // 分辨率倍数

        var pixelRatio = window.devicePixelRatio;
        var clientWidth = canvas.clientWidth;
        var clientHeight = canvas.clientHeight;
        var width = clientWidth * pixelRatio | 0;
        var height = clientHeight * pixelRatio | 0;
        var needResize = canvas.width !== width || canvas.height !== height;

        if (needResize) {
          renderer.setSize(width, height, false);

          if (camera) {
            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();

            if (scene) {
              renderer.render(scene, camera);
            }
          }
        }
      };

      resize();
      window.addEventListener('resize', resize);
    }
  }]);

  return BaseClass;
}();

/* harmony default export */ var baseClass = (BaseClass);
;// CONCATENATED MODULE: ./src/example/temp7/index.ts










function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,getPrototypeOf/* default */.Z)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,getPrototypeOf/* default */.Z)(this).constructor; result = construct_default()(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,possibleConstructorReturn/* default */.Z)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !(construct_default())) return false; if ((construct_default()).sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(construct_default()(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/*
 * @Description 加载模型
 * @Author bihongbin
 * @Date 2021-09-23 10:10:46
 * @LastEditors bihongbin
 * @LastEditTime 2021-10-25 14:23:07
 */




 // const checker = require('@/assets/images/checker.png');

var volkswagenMtl = __webpack_require__(5135);

var volkswagen = __webpack_require__(4849);

var ThreeTemplate7 = /*#__PURE__*/function (_BaseClass) {
  (0,inherits/* default */.Z)(ThreeTemplate7, _BaseClass);

  var _super = _createSuper(ThreeTemplate7);

  // 场景
  // 渲染器
  // 透视摄像机
  // 轨道控制器
  // TextureLoader
  // OBJLoader
  // MtlLoader
  // 地面大小
  function ThreeTemplate7() {
    var _this;

    (0,classCallCheck/* default */.Z)(this, ThreeTemplate7);

    _this = _super.call(this); // 创建场景

    (0,defineProperty/* default */.Z)((0,assertThisInitialized/* default */.Z)(_this), "scene", void 0);

    (0,defineProperty/* default */.Z)((0,assertThisInitialized/* default */.Z)(_this), "canvas", void 0);

    (0,defineProperty/* default */.Z)((0,assertThisInitialized/* default */.Z)(_this), "camera", void 0);

    (0,defineProperty/* default */.Z)((0,assertThisInitialized/* default */.Z)(_this), "orbitControls", void 0);

    (0,defineProperty/* default */.Z)((0,assertThisInitialized/* default */.Z)(_this), "textureLoader", new three_module/* TextureLoader */.dpR());

    (0,defineProperty/* default */.Z)((0,assertThisInitialized/* default */.Z)(_this), "objLoader", new OBJLoader/* OBJLoader */.L());

    (0,defineProperty/* default */.Z)((0,assertThisInitialized/* default */.Z)(_this), "mtlLoader", new MTLLoader/* MTLLoader */.v());

    (0,defineProperty/* default */.Z)((0,assertThisInitialized/* default */.Z)(_this), "planeSize", 200);

    _this.scene = _this.createScene(); // 创建渲染器

    _this.canvas = _this.createCanvas(); // 创建透视摄像机

    _this.camera = _this.createPerspectiveCamera(); // 创建轨道控制器

    _this.orbitControls = _this.createOrbitControls(); // 创建内容

    _this.createBody();

    return _this;
  } // 场景


  (0,createClass/* default */.Z)(ThreeTemplate7, [{
    key: "createScene",
    value: function createScene() {
      var scene = new three_module/* Scene */.xsS();
      return scene;
    } // 渲染器

  }, {
    key: "createCanvas",
    value: function createCanvas() {
      var canvas = new three_module/* WebGLRenderer */.CP7({
        // 消除锯齿
        antialias: true
      });
      canvas.setClearColor(0x666666);
      document.body.appendChild(canvas.domElement);
      return canvas;
    } // 透视摄像机

  }, {
    key: "createPerspectiveCamera",
    value: function createPerspectiveCamera() {
      var fov = 45;
      var aspect = 2;
      var near = 0.1;
      var far = 1000;
      var camera = new three_module/* PerspectiveCamera */.cPb(fov, aspect, near, far);
      camera.position.set(0, 10, 100); // 透视摄像机自适应

      (0,get/* default */.Z)((0,getPrototypeOf/* default */.Z)(ThreeTemplate7.prototype), "resizePerspectiveCameraDisplaySize", this).call(this, this.canvas, camera, this.scene);

      return camera;
    } // 轨道控制器

  }, {
    key: "createOrbitControls",
    value: function createOrbitControls() {
      var controls = new OrbitControls/* OrbitControls */.z(this.camera, this.canvas.domElement);
      controls.addEventListener('change', this.render.bind(this));
      return controls;
    } // 内容

  }, {
    key: "createBody",
    value: function createBody() {
      // 创建光
      this.createLight(); // 创建地面

      this.createGround(); // 加载模型

      this.createModel();
    } // 光

  }, {
    key: "createLight",
    value: function createLight() {
      // 环境光
      var ambient = new three_module/* AmbientLight */.Mig(0x666666, 0.75);
      this.scene.add(ambient); // 平行光

      var directional = new three_module/* DirectionalLight */.Ox3(0x989898, 0.75);
      directional.position.set(0, 30, 0);
      this.scene.add(directional);
    } // 地面

  }, {
    key: "createGround",
    value: function createGround() {
      // 地面贴图
      // this.textureLoader.load(checker, (texture) => {
      //   const repeats = this.planeSize / 2;
      //   // 贴图水平方向包裹方式
      //   texture.wrapS = THREE.RepeatWrapping;
      //   // 贴图垂直方向包裹方式
      //   texture.wrapT = THREE.RepeatWrapping;
      //   // 使用最接近的贴图的值
      //   texture.magFilter = THREE.NearestFilter;
      //   // x,y方向重复多少次
      //   texture.repeat.set(repeats, repeats);
      //   // 平面体
      //   const planeGeo = new THREE.PlaneGeometry(this.planeSize, this.planeSize);
      //   // 材质
      //   const planeMat = new THREE.MeshBasicMaterial({
      //     map: texture,
      //     // 双面材质
      //     side: THREE.DoubleSide,
      //   });
      //   const mesh = new THREE.Mesh(planeGeo, planeMat);
      //   mesh.rotation.x = Math.PI * -0.5;
      //   this.scene.add(mesh);
      //   this.render();
      // });
      // 网格辅助对象
      var grid = new three_module/* GridHelper */.VLJ(this.planeSize, 40);
      this.scene.add(grid); // 地面

      var planeGeometry = new three_module/* PlaneGeometry */._12(this.planeSize, this.planeSize);
      var planeMaterial = new three_module/* MeshLambertMaterial */.YBo({
        color: 0xffffff
      });
      var plane = new three_module/* Mesh */.Kj0(planeGeometry, planeMaterial);
      plane.rotation.x = Math.PI * -0.5;
      this.scene.add(plane);
    } // 大众汽车模型

  }, {
    key: "createModel",
    value: function createModel() {
      var _this2 = this;

      // 材质
      this.mtlLoader.load(volkswagenMtl, function (mtl) {
        mtl.preload();

        _this2.objLoader.setMaterials(mtl); // 模型


        _this2.objLoader.load(volkswagen, function (group) {
          console.log('group', group);
          group.scale.set(0.01, 0.01, 0.01);

          _this2.scene.add(group);

          _this2.render();
        });
      });
    } // 渲染

  }, {
    key: "render",
    value: function render() {
      this.canvas.render(this.scene, this.camera);
    }
  }]);

  return ThreeTemplate7;
}(baseClass);


;// CONCATENATED MODULE: ./src/index.ts


new ThreeTemplate7().render();

/***/ }),

/***/ 5135:
/***/ (function(module) {

module.exports = "data:model/mtl;base64,IyAzZHMgTWF4IFdhdmVmcm9udCBPQkogRXhwb3J0ZXIgdjAuOTdiIC0gKGMpMjAwNyBndXJ1d2FyZQ0KIyC0tL2otcTOxLz+OjAxLjA2LjIwMTUgMTY6MjY6NTQNCg0KbmV3bXRsIHNpbHZlcg0KCU5zIDMwLjAwMDANCglOaSAxLjUwMDANCglkIDEuMDAwMA0KCVRyIDAuMDAwMA0KCVRmIDEuMDAwMCAxLjAwMDAgMS4wMDAwIA0KCWlsbHVtIDINCglLYSAxLjAwMDAgMS4wMDAwIDEuMDAwMA0KCUtkIDEuMDAwMCAxLjAwMDAgMS4wMDAwDQoJS3MgMC40MDUwIDAuNDA1MCAwLjQwNTANCglLZSAwLjAwMDAgMC4wMDAwIDAuMDAwMA0KDQpuZXdtdGwgZ3VtDQoJTnMgMzAuMDAwMA0KCU5pIDEuNTAwMA0KCWQgMS4wMDAwDQoJVHIgMC4wMDAwDQoJVGYgMS4wMDAwIDEuMDAwMCAxLjAwMDAgDQoJaWxsdW0gMg0KCUthIDAuMTEzNyAwLjExMzcgMC4xMTM3DQoJS2QgMC4xMTM3IDAuMTEzNyAwLjExMzcNCglLcyAwLjQwNTAgMC40MDUwIDAuNDA1MA0KCUtlIDAuMDAwMCAwLjAwMDAgMC4wMDAwDQoNCm5ld210bCBjaHJvbWUNCglOcyAzMC4wMDAwDQoJTmkgMS41MDAwDQoJZCAxLjAwMDANCglUciAwLjAwMDANCglUZiAxLjAwMDAgMS4wMDAwIDEuMDAwMCANCglpbGx1bSAyDQoJS2EgMS4wMDAwIDEuMDAwMCAxLjAwMDANCglLZCAxLjAwMDAgMS4wMDAwIDEuMDAwMA0KCUtzIDAuNDA1MCAwLjQwNTAgMC40MDUwDQoJS2UgMC4wMDAwIDAuMDAwMCAwLjAwMDANCg0KbmV3bXRsIGJsYWNrX20NCglOcyA2Ni4wMDAwDQoJTmkgMS41MDAwDQoJZCAxLjAwMDANCglUciAwLjAwMDANCglUZiAxLjAwMDAgMS4wMDAwIDEuMDAwMCANCglpbGx1bSAyDQoJS2EgMC4xMTM3IDAuMTEzNyAwLjExMzcNCglLZCAwLjExMzcgMC4xMTM3IDAuMTEzNw0KCUtzIDAuOTk5MCAwLjk5OTAgMC45OTkwDQoJS2UgMC4wMDAwIDAuMDAwMCAwLjAwMDANCg0KbmV3bXRsIGdyZXkNCglOcyAxMC4wMDAwDQoJTmkgMS41MDAwDQoJZCAxLjAwMDANCglUciAwLjAwMDANCglUZiAxLjAwMDAgMS4wMDAwIDEuMDAwMCANCglpbGx1bSAyDQoJS2EgMC41ODgyIDAuNTg4MiAwLjU4ODINCglLZCAwLjU4ODIgMC41ODgyIDAuNTg4Mg0KCUtzIDAuMDAwMCAwLjAwMDAgMC4wMDAwDQoJS2UgMC4wMDAwIDAuMDAwMCAwLjAwMDANCg0KbmV3bXRsIGJvZHkNCglOcyAzMC4wMDAwDQoJTmkgMS41MDAwDQoJZCAxLjAwMDANCglUciAwLjAwMDANCglUZiAxLjAwMDAgMS4wMDAwIDEuMDAwMCANCglpbGx1bSAyDQoJS2EgMC44NjY3IDAuMDAwMCAwLjAwMDANCglLZCAwLjg2NjcgMC4wMDAwIDAuMDAwMA0KCUtzIDAuNDA1MCAwLjQwNTAgMC40MDUwDQoJS2UgMC4wMDAwIDAuMDAwMCAwLjAwMDANCg0KbmV3bXRsIGdsYXNzDQoJTnMgNjYuMDAwMA0KCU5pIDEuNTAwMA0KCWQgMC41NTAwDQoJVHIgMC40NTAwDQoJVGYgMC41NTAwIDAuNTUwMCAwLjU1MDAgDQoJaWxsdW0gMg0KCUthIDEuMDAwMCAxLjAwMDAgMS4wMDAwDQoJS2QgMS4wMDAwIDEuMDAwMCAxLjAwMDANCglLcyAwLjk5OTAgMC45OTkwIDAuOTk5MA0KCUtlIDAuMDAwMCAwLjAwMDAgMC4wMDAwDQoNCm5ld210bCBkX2dsYXNzDQoJTnMgNjYuMDAwMA0KCU5pIDEuNTAwMA0KCWQgMC41NTAwDQoJVHIgMC40NTAwDQoJVGYgMC41NTAwIDAuNTUwMCAwLjU1MDAgDQoJaWxsdW0gMg0KCUthIDAuMDAwMCAwLjAwMDAgMC4wMDAwDQoJS2QgMC4wMDAwIDAuMDAwMCAwLjAwMDANCglLcyAwLjk5OTAgMC45OTkwIDAuOTk5MA0KCUtlIDAuMDAwMCAwLjAwMDAgMC4wMDAwDQoNCm5ld210bCBNYXRlcmlhbF9fMA0KCU5zIDMwLjAwMDANCglOaSAxLjUwMDANCglkIDEuMDAwMA0KCVRyIDAuMDAwMA0KCVRmIDEuMDAwMCAxLjAwMDAgMS4wMDAwIA0KCWlsbHVtIDINCglLYSAxLjAwMDAgMS4wMDAwIDEuMDAwMA0KCUtkIDEuMDAwMCAxLjAwMDAgMS4wMDAwDQoJS3MgMC40MDUwIDAuNDA1MCAwLjQwNTANCglLZSAwLjAwMDAgMC4wMDAwIDAuMDAwMA0KDQpuZXdtdGwgYmxhY2sNCglOcyAxMC4wMDAwDQoJTmkgMS41MDAwDQoJZCAxLjAwMDANCglUciAwLjAwMDANCglUZiAxLjAwMDAgMS4wMDAwIDEuMDAwMCANCglpbGx1bSAyDQoJS2EgMC4wMDAwIDAuMDAwMCAwLjAwMDANCglLZCAwLjAwMDAgMC4wMDAwIDAuMDAwMA0KCUtzIDAuMDAwMCAwLjAwMDAgMC4wMDAwDQoJS2UgMC4wMDAwIDAuMDAwMCAwLjAwMDANCg0KbmV3bXRsIE1hdGVyaWFsX18xMw0KCU5zIDMwLjAwMDANCglOaSAxLjUwMDANCglkIDEuMDAwMA0KCVRyIDAuMDAwMA0KCVRmIDEuMDAwMCAxLjAwMDAgMS4wMDAwIA0KCWlsbHVtIDINCglLYSAwLjExMzcgMC4xMTM3IDAuMTEzNw0KCUtkIDAuMTEzNyAwLjExMzcgMC4xMTM3DQoJS3MgMC40MDUwIDAuNDA1MCAwLjQwNTANCglLZSAwLjAwMDAgMC4wMDAwIDAuMDAwMA0KDQpuZXdtdGwgcGxhdGUNCglOcyA2Ni4wMDAwDQoJTmkgMS41MDAwDQoJZCAxLjAwMDANCglUciAwLjAwMDANCglUZiAxLjAwMDAgMS4wMDAwIDEuMDAwMCANCglpbGx1bSAyDQoJS2EgMC4yNzA2IDAuMjcwNiAwLjI3MDYNCglLZCAwLjI3MDYgMC4yNzA2IDAuMjcwNg0KCUtzIDAuOTk5MCAwLjk5OTAgMC45OTkwDQoJS2UgMC4wMDAwIDAuMDAwMCAwLjAwMDANCg0KbmV3bXRsIHJfZ2xhc3MNCglOcyA2Ni4wMDAwDQoJTmkgMS41MDAwDQoJZCAwLjU1MDANCglUciAwLjQ1MDANCglUZiAwLjU1MDAgMC41NTAwIDAuNTUwMCANCglpbGx1bSAyDQoJS2EgMC41MDIwIDAuMDAwMCAwLjAwMDANCglLZCAwLjUwMjAgMC4wMDAwIDAuMDAwMA0KCUtzIDAuOTk5MCAwLjk5OTAgMC45OTkwDQoJS2UgMC4wMDAwIDAuMDAwMCAwLjAwMDANCg0KbmV3bXRsIGxlYXRoZXJfZA0KCU5zIDM0LjAwMDANCglOaSAxLjUwMDANCglkIDEuMDAwMA0KCVRyIDAuMDAwMA0KCVRmIDEuMDAwMCAxLjAwMDAgMS4wMDAwIA0KCWlsbHVtIDINCglLYSAwLjI0MzEgMC4yNDMxIDAuMjQzMQ0KCUtkIDAuMjQzMSAwLjI0MzEgMC4yNDMxDQoJS3MgMC43MTEwIDAuNzExMCAwLjcxMTANCglLZSAwLjAwMDAgMC4wMDAwIDAuMDAwMA0KDQpuZXdtdGwgcmVkDQoJTnMgMzAuMDAwMA0KCU5pIDEuNTAwMA0KCWQgMS4wMDAwDQoJVHIgMC4wMDAwDQoJVGYgMS4wMDAwIDEuMDAwMCAxLjAwMDAgDQoJaWxsdW0gMg0KCUthIDAuNDQ3MSAwLjAwMDAgMC4wMDAwDQoJS2QgMC40NDcxIDAuMDAwMCAwLjAwMDANCglLcyAwLjQwNTAgMC40MDUwIDAuNDA1MA0KCUtlIDAuMDAwMCAwLjAwMDAgMC4wMDAwDQoNCm5ld210bCBNYXRlcmlhbF9fMTcNCglOcyA2Ni4wMDAwDQoJTmkgMS41MDAwDQoJZCAwLjU1MDANCglUciAwLjQ1MDANCglUZiAwLjU1MDAgMC41NTAwIDAuNTUwMCANCglpbGx1bSAyDQoJS2EgMC41MDIwIDAuMDAwMCAwLjAwMDANCglLZCAwLjUwMjAgMC4wMDAwIDAuMDAwMA0KCUtzIDAuOTk5MCAwLjk5OTAgMC45OTkwDQoJS2UgMC4wMDAwIDAuMDAwMCAwLjAwMDANCg0KbmV3bXRsIE1hdGVyaWFsX18yMA0KCU5zIDY2LjAwMDANCglOaSAxLjUwMDANCglkIDEuMDAwMA0KCVRyIDAuMDAwMA0KCVRmIDEuMDAwMCAxLjAwMDAgMS4wMDAwIA0KCWlsbHVtIDINCglLYSAwLjExMzcgMC4xMTM3IDAuMTEzNw0KCUtkIDAuMTEzNyAwLjExMzcgMC4xMTM3DQoJS3MgMC45OTkwIDAuOTk5MCAwLjk5OTANCglLZSAwLjAwMDAgMC4wMDAwIDAuMDAwMA0KDQpuZXdtdGwgTWF0ZXJpYWxfXzE5DQoJTnMgMzAuMDAwMA0KCU5pIDEuNTAwMA0KCWQgMS4wMDAwDQoJVHIgMC4wMDAwDQoJVGYgMS4wMDAwIDEuMDAwMCAxLjAwMDAgDQoJaWxsdW0gMg0KCUthIDEuMDAwMCAxLjAwMDAgMS4wMDAwDQoJS2QgMS4wMDAwIDEuMDAwMCAxLjAwMDANCglLcyAwLjQwNTAgMC40MDUwIDAuNDA1MA0KCUtlIDAuMDAwMCAwLjAwMDAgMC4wMDAwDQoNCm5ld210bCBsb2dvDQoJTnMgMTAuMDAwMA0KCU5pIDEuNTAwMA0KCWQgMS4wMDAwDQoJVHIgMC4wMDAwDQoJVGYgMS4wMDAwIDEuMDAwMCAxLjAwMDAgDQoJaWxsdW0gMg0KCUthIDAuNTg4MiAwLjU4ODIgMC41ODgyDQoJS2QgMC41ODgyIDAuNTg4MiAwLjU4ODINCglLcyAwLjAwMDAgMC4wMDAwIDAuMDAwMA0KCUtlIDAuMDAwMCAwLjAwMDAgMC4wMDAwDQoNCm5ld210bCBsaWdodHMNCglOcyAxMC4wMDAwDQoJTmkgMS41MDAwDQoJZCAxLjAwMDANCglUciAwLjAwMDANCglUZiAxLjAwMDAgMS4wMDAwIDEuMDAwMCANCglpbGx1bSAyDQoJS2EgMS4wMDAwIDEuMDAwMCAxLjAwMDANCglLZCAxLjAwMDAgMS4wMDAwIDEuMDAwMA0KCUtzIDAuMDAwMCAwLjAwMDAgMC4wMDAwDQoJS2UgMS4wMDAwIDEuMDAwMCAxLjAwMDANCg=="

/***/ }),

/***/ 4849:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/car_b5929e9f2951c26c0b3e827df23dcc0d.obj";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../";
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			296: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkthree"] = self["webpackChunkthree"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [736], function() { return __webpack_require__(6531); })
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;