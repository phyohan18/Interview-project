import { useEffect,useState } from "react";

import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";


const ThreeJS = ({ image }) => {
  const [curImage , setCurImage ] = useState(image);

  useEffect(() => {
    let isUserInteracting = false,
      onPointerDownMouseX = 0,
      onPointerDownMouseY = 0,
      lon = 0,
      onPointerDownLon = 0,
      lat = 0,
      onPointerDownLat = 0,
      phi = 0,
      theta = 0;

    const canvas = document.getElementById("myThreeJsCanvas");

    //Showing FPS
    const stats = Stats();
    canvas.appendChild(stats.dom);

    //Scene Set up
    const scene = new THREE.Scene();

    //Camera Setup
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 1;
    const far = 1100;

    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    //Render Setup
    let renderer = new THREE.WebGL1Renderer({
      canvas: canvas,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    canvas.style.touchAction = "none";
    canvas.addEventListener("pointerdown", onPointerDown);

    canvas.addEventListener("wheel", onDocumentMouseWheel);

    canvas.addEventListener("dragover", function (event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    });

    canvas.addEventListener("dragenter", function () {
        canvas.body.style.opacity = 0.5;
    });

    canvas.addEventListener("dragleave", function () {
        canvas.body.style.opacity = 1;
    });

    // loading texture
    let loader = new THREE.TextureLoader();
    let texture = loader.load(curImage);

    // Making Sphere
    const sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const sphereMash = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphereMash);

    // Recursion function for animation
    const animate = () => {
      requestAnimationFrame(animate);
      cameraRotate();
      stats.update();
    };
    const cameraRotate = () => {
      if (isUserInteracting === false) {
        lon += 0.0;
      }

      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);

      const x = 500 * Math.sin(phi) * Math.cos(theta);
      const y = 500 * Math.cos(phi);
      const z = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(x, y, z);
      renderer.render(scene, camera);
    };
    animate();
    window.addEventListener("resize", onWindowResize);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    function onPointerDown(event) {
      if (event.isPrimary === false) return;

      isUserInteracting = true;

      onPointerDownMouseX = event.clientX;
      onPointerDownMouseY = event.clientY;

      onPointerDownLon = lon;
      onPointerDownLat = lat;

      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerup", onPointerUp);
    }

    function onPointerMove(event) {
      if (event.isPrimary === false) return;

      lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
      lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;
    }

    function onPointerUp() {
      if (event.isPrimary === false) return;

      isUserInteracting = false;

      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
    }

    function onDocumentMouseWheel(event) {
      const fov = camera.fov + event.deltaY * 0.05;

      camera.fov = THREE.MathUtils.clamp(fov, 10, 75);

      camera.updateProjectionMatrix();
    }
  });

  return (
    // <div>
      <canvas id="myThreeJsCanvas"></canvas>
      /* <button className="button" onClick={()=>setCurImage(Image2)}>Prev</button>
      <button className="button-right" onClick={()=>setCurImage(Image)}>Next</button>
    </div> */
  );
};

export default ThreeJS;