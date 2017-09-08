// import * as THREE from 'three';

import {AmbientLight, Camera, Clock, DirectionalLight, PerspectiveCamera, Plane, Raycaster, Scene, Vector2, Vector3, WebGLRenderer} from 'three';

import { Bounds } from '../geometry/basic';
import { MapControls } from '../controls/mapControls';

export default class Renderer {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: Camera;
    controls: any;
    clock = new Clock();
    plane: Plane;

    constructor(container: HTMLElement) {
        const camera = this.camera = new PerspectiveCamera(60, container.clientWidth / container.clientHeight, 1, 20000000);
        const scene = this.scene = new Scene();

        // let controls = this.controls = new OrbitControls(camera, container);
        // controls.target.set(142892.19, 470783.87, 0);

        // controls.minAzimuthAngle = - 0.5 * Math.PI; // radians
        // controls.maxAzimuthAngle = 0.5 * Math.PI; // radians

        const licht1 = new DirectionalLight(0xffffff, 0.6);
        licht1.position.set(0, 0, 1);
        // licht.target.position.set(142892.19, 470783.87, 250000);
        scene.add(licht1);
        // scene.add(licht.target);

        const licht = new AmbientLight(0x404040, 1);
        scene.add(licht);

        const renderer = this.renderer = new WebGLRenderer({
            antialias: true,
            logarithmicDepthBuffer: true,
        });
        renderer.setClearColor(0xbfd1e5);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);

        container.appendChild(renderer.domElement);

        camera.position.set(142892.19, 470783.87, 250000);
        // camera.position.set(-285401.920, 903401.920, 250000);

        camera.up.set(0, 0, 1);

        const plane = this.plane = new Plane(new Vector3(0, 0, 1));

        const controls = new MapControls(camera, renderer, plane);

        // let sg = new SphereBufferGeometry(20000, 32, 32);
        // let sp = new Mesh(sg);
        // sp.position.copy(controls.target);
        // scene.add(sp);

        // controls.addEventListener('change', () => {
        //     this.render();
        //     sp.position.copy(controls.target);

        // });

        controls.onChange = () => {
            this.render();
        };

        this.render();
    }

    animate = () => {
        requestAnimationFrame(this.render);

        this.render();
    }

    render = () => {
        // this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    getBounds() {
        const bottomLeftRay = new Raycaster();
        const topRightRay = new Raycaster();

        bottomLeftRay.setFromCamera(new Vector2(-1, -1), this.camera);
        topRightRay.setFromCamera(new Vector2(1, 1), this.camera);

        return new Bounds(
            bottomLeftRay.ray.intersectPlane(this.plane),
            topRightRay.ray.intersectPlane(this.plane),
        );
    }
}
