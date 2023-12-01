"use strict";
import * as THREE from 'three';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

let scene, camera, renderer;
let canvas;
let ambient_light, camera_light, controls;

function createScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0,0,0);

    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 100);
    camera.position.set(2, 2, 1);
    scene.add(camera);

    ambient_light = new THREE.AmbientLight("white", 0.5);
    scene.add(ambient_light);

    camera_light = new THREE.DirectionalLight("white", 1.0);
    camera.add(camera_light);

    loadSTLModel();
}

function loadSTLModel() {
    const loader = new STLLoader();
    loader.load('BabyYoda.stl', function (geometry) {
        geometry.center();
        const material = new THREE.MeshStandardMaterial({ color: 0x22B176 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        mesh.scale.set(0.01, 0.01, 0.01);
        scene.add(mesh);
    }, undefined, function (error) {
        console.error('Error loading STL file:', error);
    });
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    // TODO: modifier pour utiliser un postprocessing
}

function init() {
    try {
        canvas = document.getElementById("canvas");
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        // Création de la scène 3D
        createScene();

        // TODO: Ajout de l'interactivité avec la souris
        controls = new ArcballControls(camera, canvas, scene);
        controls.setGizmosVisible(false);
        animate();
    } catch (e) {
        document.getElementById("canvas-holder").innerHTML="<p><b>Sorry, an error occurred:<br>" +
            e + "</b></p>";
        return;
    }

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        'Fond/posx.jpg', 
        'Fond/negx.jpg', 
        'Fond/posy.jpg', 
        'Fond/negy.jpg', 
        'Fond/posz.jpg', 
        'Fond/negz.jpg', 
    ]);

    scene.background = texture;


    
    // TODO: Importation des textures

    // Création du matériau shader
    const vertexShaderSource = loadFile("./tp3.vert");
    const fragmentShaderSource = loadFile("./tp3.frag");
    let material = createMaterial(vertexShaderSource, fragmentShaderSource);

    // TODO: Importation du modèle 3D
    
    // TODO: Ajout de l'interactivité avec la souris

    // TODO: Postprocessing

    // Animation de la scèene (appelée toutes les 30 ms)
}

init();
