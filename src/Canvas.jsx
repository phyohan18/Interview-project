import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const Canvas = ({ curImg }) => {
  const canvasRef = useRef();
  const sphereMeshRef = useRef();
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

    const scene = new THREE.Scene();
    //Camera Setup
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 1;
    const far = 1100;

    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    //Render Setup
    let renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });

    renderer.setSize(
      canvasRef.current.clientWidth,
      canvasRef.current.clientHeight
    );

    renderer.setPixelRatio(window.devicePixelRatio);
    canvasRef.current.style.touchAction = "none";
    canvasRef.current.addEventListener("pointerdown", onPointerDown);

    canvasRef.current.addEventListener("wheel", onDocumentMouseWheel);

    canvasRef.current.addEventListener("dragover", function (event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    });

    canvasRef.current.addEventListener("dragenter", function () {
      canvasRef.current.body.style.opacity = 0.5;
    });

    canvasRef.current.addEventListener("dragleave", function () {
      canvasRef.current.body.style.opacity = 1;
    });
    // Making Sphere
    const sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
    });
    sphereMeshRef.current = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphereMeshRef.current);

    // Recursion function for animation
    const animate = () => {
      requestAnimationFrame(animate);
      cameraRotate();
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

      canvasRef.current.addEventListener("pointermove", onPointerMove);
      canvasRef.current.addEventListener("pointerup", onPointerUp);
    }

    function onPointerMove(event) {
      if (event.isPrimary === false) return;

      lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
      lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;
    }

    function onPointerUp() {
      if (event.isPrimary === false) return;

      isUserInteracting = false;

      canvasRef.current.removeEventListener("pointermove", onPointerMove);
      canvasRef.current.removeEventListener("pointerup", onPointerUp);
    }

    function onDocumentMouseWheel(event) {
      const fov = camera.fov + event.deltaY * 0.05;

      camera.fov = THREE.MathUtils.clamp(fov, 10, 75);

      camera.updateProjectionMatrix();
    }
    return () => {
      scene.current.remove(sphereMeshRef.current);
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    // loading texture
    let loader = new THREE.TextureLoader();
    let texture = loader.load(curImg, function(){
      // Updating Sphere Texture
      sphereMeshRef.current.material.map = texture;
      sphereMeshRef.current.material.needsUpdate = true;
    });
    return () => {
      texture.dispose();
    };
  }, [curImg]);

  return <canvas ref={canvasRef} id="three" style={{ width: "100%" }}></canvas>;
};

export default React.memo(Canvas);
