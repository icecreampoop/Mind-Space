import * as THREE from 'three'
import { getPlayerAnimationsMap, getPlayerMixer, getPlayerModel, getPlayerPhysicsBody } from '../loaders/PlayerLoader'

export class CharacterControls {
    private DIRECTIONS = ['w', 'a', 's', 'd']
    private keysPressed = {}

    private model: THREE.Object3D<THREE.Object3DEventMap>;
    private mixer: THREE.AnimationMixer
    private animationsMap: Map<string, THREE.AnimationAction> = new Map()
    private camera: THREE.PerspectiveCamera;

    // state
    private currentAction: string

    // temporary data
    private walkDirection = new THREE.Vector3()
    private rotateAngle = new THREE.Vector3(0, 1, 0)
    private rotateQuarternion: THREE.Quaternion = new THREE.Quaternion()
    private cameraTarget = new THREE.Vector3()

    // constants
    private fadeDuration: number = 0.2

    constructor(currentAction: string, camera: THREE.PerspectiveCamera) {
        this.model = getPlayerModel();
        this.init();
        this.currentAction = currentAction
        this.camera = camera;

        //add key listener
        document.addEventListener('keydown', (event) => {
            (this.keysPressed as any)[event.key.toLowerCase()] = true;
        }, false);
        document.addEventListener('keyup', (event) => {
            (this.keysPressed as any)[event.key.toLowerCase()] = false
        }, false);

    }

    private async init() {
        this.mixer = await getPlayerMixer();
        this.animationsMap = await getPlayerAnimationsMap();

        if (this.model) {
            this.model.rotation.set(0, Math.PI, 0);
        }

        this.animationsMap.forEach((value, key) => {
            if (key == this.currentAction) {
                value.play()
            }
        })
    }

    public update(delta: number) {
        const directionPressed = this.DIRECTIONS.some(key => this.keysPressed[key] == true)

        var play = '';
        if (directionPressed) {
            play = 'mousey_run'
        } else if (this.keysPressed[" "]) {
            //cannot really alternate and no time alr bru
            play = 'mousey_punch1'
        } else {
            play = 'mousey_breathing_idle'
        }

        if (this.animationsMap.get(this.currentAction)) {
            if (this.currentAction != play) {
                const toPlay = this.animationsMap.get(play)
                const current = this.animationsMap.get(this.currentAction)

                current.fadeOut(this.fadeDuration)
                toPlay.reset().fadeIn(this.fadeDuration).play();

                this.currentAction = play
            }
        }

        if (this.mixer) {
            this.mixer.update(delta)
        }

        if (this.currentAction == 'mousey_run') {
            // calculate towards camera direction
            // took me so long to fix the mesh direction bruh
            var angleYCameraDirection = Math.atan2(
                (this.model.position.x - this.camera.position.x),
                (this.model.position.z - this.camera.position.z))

            // diagonal movement angle offset
            var directionOffset = this.directionOffset(this.keysPressed)

            // rotate model
            this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffset)
            this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.1)

            // calculate direction
            this.camera.getWorldDirection(this.walkDirection)
            this.walkDirection.y = 0
            this.walkDirection.normalize()
            this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset)

            // move model & camera
            //this.walkDirection.x * 10 * delta
            //10 is speed (velocity)
            const moveX = this.walkDirection.x * 10 * delta
            const moveZ = this.walkDirection.z * 10 * delta
            getPlayerPhysicsBody().position.x += moveX;
            getPlayerPhysicsBody().position.z += moveZ;
            this.updateCameraTarget(moveX, moveZ);
        }
    }

    private updateCameraTarget(moveX: number, moveZ: number) {
        // move camera
        this.camera.position.x += moveX
        this.camera.position.z += moveZ

        // update camera target
        this.cameraTarget.x = this.model.position.x
        this.cameraTarget.y = this.model.position.y + 1
        this.cameraTarget.z = this.model.position.z
    }


    private directionOffset(keysPressed: any) {
        var directionOffset = 0 // w

        if (keysPressed['w']) {
            if (keysPressed['a']) {
                directionOffset = Math.PI / 4 // w+a
            } else if (keysPressed['d']) {
                directionOffset = - Math.PI / 4 // w+d
            }
        } else if (keysPressed['s']) {
            if (keysPressed['a']) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
            } else if (keysPressed['d']) {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d
            } else {
                directionOffset = Math.PI // s
            }
        } else if (keysPressed['a']) {
            directionOffset = Math.PI / 2 // a
        } else if (keysPressed['d']) {
            directionOffset = - Math.PI / 2 // d
        }

        return directionOffset
    }
}