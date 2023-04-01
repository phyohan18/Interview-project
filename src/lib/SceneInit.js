import * as THREE from "three";

export default class SceneInit {
  constructor(canvas) {
    // NOTE: Core components to initialize Three.js app.
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;

    // NOTE: Sphere params
    this.sphereMesh = undefined;
    this.sphereGeometry = undefined;
    this.sphereMaterial = undefined;
    this.texture = undefined;

    // NOTE: Camera params
    this.fov = 75;
    this.nearPlane = 1;
    this.farPlane = 1100;
    this.canvas = canvas;

    // NOTE: Event params
    this.isUserInteracting = false;
    this.onPointerDownMouseX = 0;
    this.onPointerDownMouseY = 0;
    this.lon = 0;
    this.onPointerDownLon = 0;
    this.lat = 0;
    this.onPointerDownLat = 0;
    this.phi = 0;
    this.theta = 0;

    // Bind event listener methods to the class instance
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onDocumentMouseWheel = this.onDocumentMouseWheel.bind(this);
  }

  initialize() {
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      this.nearPlane,
      this.farPlane
    );

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.canvas.style.touchAction = "none";

    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    this.canvas.addEventListener("wheel", this.onDocumentMouseWheel);
    this.canvas.addEventListener("dragover", function (event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    });
    this.canvas.addEventListener("dragenter", function () {
      this.canvas.body.style.opacity = 0.5;
    });
    this.canvas.addEventListener("dragleave", function () {
      this.canvas.body.style.opacity = 1;
    });
    this.scene = new THREE.Scene();

    // NOTE: Making Sphere
    this.sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
    this.sphereMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
    });
    this.sphereMesh = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
    this.scene.add(this.sphereMesh);
    window.addEventListener("resize", this.onWindowResize);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.cameraRotate();
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  cameraRotate() {
    if (this.isUserInteracting === false) {
      this.lon += 0.0;
    }

    this.lat = Math.max(-85, Math.min(85, this.lat));
    this.phi = THREE.MathUtils.degToRad(90 - this.lat);
    this.theta = THREE.MathUtils.degToRad(this.lon);

    const x = 500 * Math.sin(this.phi) * Math.cos(this.theta);
    const y = 500 * Math.cos(this.phi);
    const z = 500 * Math.sin(this.phi) * Math.sin(this.theta);

    this.camera.lookAt(x, y, z);
  }

  onWindowResize() {
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  onPointerDown(event) {
    if (event.isPrimary === false) return;

    this.isUserInteracting = true;

    this.onPointerDownMouseX = event.clientX;
    this.onPointerDownMouseY = event.clientY;

    this.onPointerDownLon = this.lon;
    this.onPointerDownLat = this.lat;

    this.canvas.addEventListener("pointermove", this.onPointerMove);
    this.canvas.addEventListener("pointerup", this.onPointerUp);
  }

  onPointerMove(event) {
    if (event.isPrimary === false) return;

    this.lon =
      (this.onPointerDownMouseX - event.clientX) * 0.1 + this.onPointerDownLon;
    this.lat =
      (event.clientY - this.onPointerDownMouseY) * 0.1 + this.onPointerDownLat;
  }

  onPointerUp(event) {
    if (event.isPrimary === false) return;

    this.isUserInteracting = false;

    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("pointerup", this.onPointerUp);
  }

  onDocumentMouseWheel(event) {
    const fov = this.camera.fov + event.deltaY * 0.05;
    this.camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
    this.camera.updateProjectionMatrix();
  }

  // Updating Sphere Texture
  updateTexture(textureImage) {
    let loader = new THREE.TextureLoader();
    this.texture = loader.load(textureImage, () => {
      // Updating Sphere Texture
      this.sphereMesh.material.map = this.texture;
      this.sphereMesh.material.needsUpdate = true;
    });
  }

  // Dispose
  cleanUpTexture() {
    if (this.texture) {
      this.texture.dispose();
    }
  }
}
